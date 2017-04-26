/**
 * Returns the list of rights of the user
 * @param {string} user_id - Unique identifier of the user.
 * @param {Object} authorized - Lists of authorized users coming from environment variables.
 * @param {string} authorized.adminUsers - Admin users.
 * @param {string} authorized.autorizedUsers - Other users.
 * @returns {Array} list of rights.
 */
function getUserRights (userId, authorized) {
    // deactivate authentication for development
    //console.log('context', process.env.context)
    if (process.env.context && process.env.context === 'DEV') return ['admin', 'view']
    let rights = []
    if (authorized.adminUsers.includes(userId)) {
        rights.push('admin', 'view')
    } else if (authorized.autorizedUsers.includes(userId)) {
        rights.push('view')
    }
    return rights
}

module.exports = getUserRights
