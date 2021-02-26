// permissions when creating a new share.
// see: https://docs.nextcloud.com/server/21/developer_manual/client_apis/OCS/ocs-share-api.html#create-a-new-share
module.exports = {
	READ: 1,
	UPDATE: 2,
	CREATE: 4,
	DELETE: 8,
	SHARE: 16,

	// useful combinations
	READ_AND_SHARE: 17,
	ALL: 31 
};
