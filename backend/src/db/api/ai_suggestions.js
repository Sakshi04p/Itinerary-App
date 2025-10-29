
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Ai_suggestionsDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const ai_suggestions = await db.ai_suggestions.create(
            {
                id: data.id || undefined,

        suggestion: data.suggestion
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return ai_suggestions;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const ai_suggestionsData = data.map((item, index) => ({
                id: item.id || undefined,

                suggestion: item.suggestion
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const ai_suggestions = await db.ai_suggestions.bulkCreate(ai_suggestionsData, { transaction });

        return ai_suggestions;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const ai_suggestions = await db.ai_suggestions.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.suggestion !== undefined) updatePayload.suggestion = data.suggestion;

        updatePayload.updatedById = currentUser.id;

        await ai_suggestions.update(updatePayload, {transaction});

        return ai_suggestions;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const ai_suggestions = await db.ai_suggestions.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of ai_suggestions) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of ai_suggestions) {
                await record.destroy({transaction});
            }
        });

        return ai_suggestions;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const ai_suggestions = await db.ai_suggestions.findByPk(id, options);

        await ai_suggestions.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await ai_suggestions.destroy({
            transaction
        });

        return ai_suggestions;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const ai_suggestions = await db.ai_suggestions.findOne(
            { where },
            { transaction },
        );

        if (!ai_suggestions) {
            return ai_suggestions;
        }

        const output = ai_suggestions.get({plain: true});

        return output;
    }

    static async findAll(filter, options) {
        const limit = filter.limit || 0;
        let offset = 0;
        let where = {};
        const currentPage = +filter.page;

        const user = (options && options.currentUser) || null;

        offset = currentPage * limit;

        const orderBy = null;

        const transaction = (options && options.transaction) || undefined;

        let include = [];

        if (filter) {
            if (filter.id) {
                where = {
                    ...where,
                    ['id']: Utils.uuid(filter.id),
                };
            }

                if (filter.suggestion) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'ai_suggestions',
                            'suggestion',
                            filter.suggestion,
                        ),
                    };
                }

            if (filter.active !== undefined) {
                where = {
                    ...where,
                    active: filter.active === true || filter.active === 'true'
                };
            }

            if (filter.createdAtRange) {
                const [start, end] = filter.createdAtRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.gte]: start,
                        },
                    };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.lte]: end,
                        },
                    };
                }
            }
        }

        const queryOptions = {
            where,
            include,
            distinct: true,
            order: filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction: options?.transaction,
            logging: console.log
        };

        if (!options?.countOnly) {
            queryOptions.limit = limit ? Number(limit) : undefined;
            queryOptions.offset = offset ? Number(offset) : undefined;
        }

        try {
            const { rows, count } = await db.ai_suggestions.findAndCountAll(queryOptions);

            return {
                rows: options?.countOnly ? [] : rows,
                count: count
            };
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }

    static async findAllAutocomplete(query, limit, offset) {
        let where = {};

        if (query) {
            where = {
                [Op.or]: [
                    { ['id']: Utils.uuid(query) },
                    Utils.ilike(
                        'ai_suggestions',
                        'suggestion',
                        query,
                    ),
                ],
            };
        }

        const records = await db.ai_suggestions.findAll({
            attributes: [ 'id', 'suggestion' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['suggestion', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.suggestion,
        }));
    }

};

