const log = require('../libs/logger')(module);
const knex = require('../libs/db').knex;
const generate = require('./gen/generator');
const dropDb = require('./0_drops');
const addUsersToDb = require('./1_users');
const addEventsToDb = require('./2_event');
const addCampsToDb = require('./3_camps');
const addCampMembers = require('./4_campMembers');
const MOCK_USERS_SCHEMA = require('./gen/mockSchema/users.schema');
const MOCK_EVENTS_SCHEMA = require('./gen/mockSchema/events.schema');
const MOCK_CAMPS_SCHEMA = require('./gen/mockSchema/camps.schema');
const utils = require('./util/utils');
const random = process.argv.includes('random');
const replaceStatic = process.argv.includes('replace');
const nosave = process.argv.includes('nosave');
const keepdb = process.argv.includes('keepdb');
const scale = Number(process.argv.pop());
const constants = require('../models/constants');

if (replaceStatic) {

}
if (nosave) {
    log.info('Running without saving to db');
}

if (scale > 40) {
    log.info('Chosen scale to big... try a smaller one');
}

const initStaticCamps = (camps, events) => {
    function getCampDiscription(id, lang) {
        switch (id) {
            case 1:
                return lang === 'en' ? 'Admin`s Camp' : 'מחנה אדמין!';
            case 2:
                return lang === 'en' ? 'Camp Managers`s Camp' : 'מחנה מנהל b';
            case 3:
                return lang === 'en' ? 'Normal User`s Camp' : 'מחנה של משתמש רגיל';
        }
    }
    /**
     * Create static camps in each events for each static user (a, b, c)
     * Unique is used to prevent unique name dups.
     */
    let unique = 0;
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    for (const event of events) {
        for (let i = 1; i <= 3; i++) {
            const newCamp = {
                ...camps[camps.length - 1],
                event_id: event.event_id,
                status: 'open',
                main_contact: i,
                moop_contact: i,
                safety_contact: i,
                contact_person_id: i,
                camp_name_he: getCampDiscription(i) + ' ' + event.event_id + ` ${unique}`,
                camp_name_en: getCampDiscription(i, 'en') + ' ' + event.event_id + ` ${unique}`,
                camp_desc_he: getCampDiscription(i) + ' ' + event.event_id + ` ${unique}`,
                camp_desc_en: getCampDiscription(i, 'en') + ' ' + event.event_id + ` ${unique}`,
                __prototype: constants.CAMP_PROTOTYPE[getRandomInt(0, 2)]
            };
            newCamp.id = camps.push(newCamp);
            unique++;
        }
    }
    return camps;
};

const correlateData = (users, camps) => {
    const campMembers = [];
    for (const camp of camps) {
        const campAdmin = users.find(user => user.user_id === camp.contact_person_id);
        if (campAdmin) {
            campMembers.push({camp_id: camp.id, user_id: campAdmin.user_id, status: 'approved_mgr'});
        }
    }
    return campMembers;
};

const seed = async (scale = 1) => {
    try {
        if (!keepdb) {
            await dropDb(knex);
        }
        let mockData;
        if (random) {
            log.info('Generating random data...');
            if (!scale) {
                console.log('When generating random data you must state scale number as last parameter');
                process.exit(1);
            }
            // Create some data for injection
            mockData = await generate(scale);
        } else {
            mockData = utils.getFromFiles([
                MOCK_USERS_SCHEMA.NAME,
                MOCK_EVENTS_SCHEMA.NAME,
                MOCK_CAMPS_SCHEMA.NAME
            ]);
        }
        const users = mockData[MOCK_USERS_SCHEMA.NAME];
        const events = mockData[MOCK_EVENTS_SCHEMA.NAME];
        let camps = mockData[MOCK_CAMPS_SCHEMA.NAME];
        if (random) {
            camps = initStaticCamps(camps, events);
        }
        // Create link between camps and users
        const campMembers = correlateData(users, camps);
        if (replaceStatic) {
            log.info('Replacing static data...');
            utils.saveFile(MOCK_USERS_SCHEMA.NAME, users);
            utils.saveFile(MOCK_EVENTS_SCHEMA.NAME, events);
            utils.saveFile(MOCK_CAMPS_SCHEMA.NAME, camps);
        }
        if (!nosave) {
            await addEventsToDb(events);
            await addUsersToDb(users);
            await addCampsToDb(camps);
            await addCampMembers(campMembers);
        }
        log.info(`Seeding process done, seeded ${users.length} users, ${camps.length} camps and ${events.length} events`);
        process.exit(0);
        return mockData;
    } catch (err) {
        log.error(`An error occurred while seeding project - ${err}`);
        process.exit(-1);
    }

};
// Activate the function
seed(scale);
