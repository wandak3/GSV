const cmd = [
	{
	  name: '1001',
	  value: 'queryPlayerAccountUid',
	  param: [ 'uid' ]
	},
	{
	  name: '1002',
	  value: 'queryPlayerUidByAccountUid',
	  param: [ 'account_type', 'account_uid' ]
	},
	{
	  name: '1004',
	  value: 'queryPlayerBinInfo',
	  param: [ 'uid' ]
	},
	{
	  name: '1005',
	  value: 'sendMail',
	  param: [
		'uid',
		'title',
		'content',
		'sender',
		'expire_time',
		'importance',
		'config_id',
		'item_limit_type',
		'tag',
		'source_type',
		'item_list (separated by ,)'
	  ]
	},
	{
	  name: '1006',
	  value: 'queryRedisMailInfo',
	  param: [ 'uid' ]
	},
	{
	  name: '1007',
	  value: 'queryPlayerPostion',
	  param: [ 'uid' ]
	},
	{
	  name: '1009',
	  value: 'queryCombatForce',
	  param: [ 'uid' ]
	},
	{ name: '1011', value: 'queryRegions', param: null },
	{
	  name: '1012',
	  value: 'queryPlayerWorldBinInfo',
	  param: [ 'uid' ]
	},
	{
	  name: '1013',
	  value: 'queryPlayerBlockBinInfo',
	  param: [ 'uid' ]
	},
	{
	  name: '1014',
	  value: 'queryPlayerGroupBinInfo',
	  param: [ 'uid', 'group_id' ]
	},
	{
	  name: '1015',
	  value: 'queryPlayerQuestBinInfo',
	  param: [ 'uid' ]
	},
	{
	  name: '1016',
	  value: 'queryPlayerItemBinInfo',
	  param: [ 'uid' ]
	},
	{
	  name: '1017',
	  value: 'queryPlayerGroupBinInfo2',
	  param: [ 'uid', 'group_id', 'block_id' ]
	},
	{
	  name: '1018',
	  value: 'queryPlayerCoopBinInfo',
	  param: [ 'uid' ]
	},
	{ name: '1101', value: 'getPlayerNum', param: null },
	{
	  name: '1102',
	  value: 'queryLoginBlackUid',
	  param: [ 'uid' ]
	},
	{
	  name: '1103',
	  value: 'updateLoginBlackUid',
	  param: [ 'uid', 'begin_time', 'end_time' ]
	},
	{
	  name: '1104',
	  value: 'delLoginBlackUid',
	  param: [ 'uid' ]
	},
	{
	  name: '1105',
	  value: 'addWhiteAccountUid',
	  param: [ 'account_type', 'account_uid' ]
	},
	{
	  name: '1106',
	  value: 'isWhiteAccountUid',
	  param: [ 'account_type', 'account_uid' ]
	},
	{
	  name: '1107',
	  value: 'queryPlayerStatusRedisData',
	  param: [ 'uid' ]
	},
	{
	  name: '1108',
	  value: 'queryPlayerOnline',
	  param: [ 'uid', 'gameserver_id' ]
	},
	{
	  name: '1109',
	  value: 'delPlayerStatusRedisData',
	  param: [ 'uid', 'last_login_rand' ]
	},
	{
	  name: '1110',
	  value: 'guestBindAccount',
	  param: [ 'account_id', 'uid', 'account_type' ]
	},
	{
	  name: '1111',
	  value: 'delItem',
	  param: [ 'uid', 'item_id', 'item_num' ]
	},
	{
	  name: '1112',
	  value: 'playerGoto',
	  param: [ 'uid', 'scene_id', 'x', 'y', 'z' ]
	},
	{
	  name: '1113',
	  value: 'resetParentQuest',
	  param: [ 'uid', 'parent_quest_id' ]
	},
	{
	  name: '1114',
	  value: 'refreshGroupSuite',
	  param: [ 'uid', 'group_id', 'suite_id' ]
	},
	{
	  name: '1115',
	  value: 'setScenePointLockStatus',
	  param: null
	},
	{
	  name: '1116',
	  value: 'gmTalk',
	  param: [ 'uid', 'msg' ]
	},
	{
	  name: '1117',
	  value: 'setNickName',
	  param: [ 'uid', 'nickname' ]
	},
	{ name: '1118', value: 'refreshShop', param: [ 'uid' ] },
	{
	  name: '1119',
	  value: 'unlockTalent',
	  param: [ 'uid', 'avatar_id', 'skill_depot_id', 'talent_id' ]
	},
	{
	  name: '1120',
	  value: 'takeoffEquip',
	  param: [ 'uid', 'avatar_id', 'equip_id' ]
	},
	{
	  name: '1121',
	  value: 'delMail',
	  param: [ 'uid', 'mail_id' ]
	},
	{
	  name: '1122',
	  value: 'finishDailyTask',
	  param: [ 'uid', 'daily_task_id' ]
	},
	{
	  name: '1123',
	  value: 'queryRedisOfflineMsg',
	  param: [ 'uid' ]
	},
	{
	  name: '1124',
	  value: 'unlockArea',
	  param: [ 'uid', 'area_id' ]
	},
	{
	  name: '1125',
	  value: 'delItemNegative',
	  param: [ 'uid', 'item_id', 'item_num' ]
	},
	{
	  name: '1126',
	  value: 'delEquip',
	  param: [ 'uid', 'guid' ]
	},
	{
	  name: '1127',
	  value: 'addItem',
	  param: [
		'uid',
		'item_id',
		'item_count',
		'[extra_params (oneof WeaponBin or ReliquaryBin)]'
	  ]
	},
	{
	  name: '1128',
	  value: 'modifyBornPos',
	  param: [ 'uid', 'scene_id', 'pos' ]
	},
	{
	  name: '1129',
	  value: 'getPlatformPlayerNum',
	  param: null
	},
	{
	  name: '1134',
	  value: 'delRedisMail',
	  param: [ 'uid', 'mail_index', 'mail_ticket' ]
	},
	{
	  name: '1135',
	  value: 'subCoinNegative',
	  param: [ 'uid', 'scoin', 'hcoin', 'mcoin', 'is_psn' ]
	},
	{
	  name: '1136',
	  value: 'bindGmUid',
	  param: [ 'gm_uid', 'player_uid' ]
	},
	{
	  name: '1137',
	  value: 'unBindGmUid',
	  param: [ 'gm_uid' ]
	},
	{
	  name: '1138',
	  value: 'getBindGmUid',
	  param: [ 'app_id' ]
	},
	{
	  name: '1139',
	  value: 'setQuestContentProgress',
	  param: [ 'uid', 'quest_id', 'finish_progress', 'fail_progress' ]
	},
	{
	  name: '1140',
	  value: 'queryOrderDataByUid',
	  param: [ 'uid', 'begin_trade_time', 'end_trade_time' ]
	},
	{
	  name: '1141',
	  value: 'queryOrderDataByTradeNo',
	  param: [ 'trade_no' ]
	},
	{
	  name: '1143',
	  value: 'finishOrder',
	  param: [ 'order_id' ]
	},
	{
	  name: '1144',
	  value: 'delRedisMailByTicket',
	  param: [ 'uid', 'mail_ticket' ]
	},
	{
	  name: '1145',
	  value: 'insertMailBlockTag',
	  param: null
	},
	{
	  name: '1146',
	  value: 'batchBlockPlayerChat',
	  param: [ 'block_list' ]
	},
	{
	  name: '1147',
	  value: 'batchUnblockPlayerChat',
	  param: [ 'unblock_uid_list (separated by ,)' ]
	},
	{
	  name: '1148',
	  value: 'queryPlayerChatBlockStatus',
	  param: [ 'uid' ]
	},
	{
	  name: '1149',
	  value: 'addOrModifyWatcher',
	  param: [ 'uid', 'watcher_id', 'progress' ]
	},
	{
	  name: '1150',
	  value: 'delWatcher',
	  param: [ 'uid', 'watcher_id' ]
	},
	{
	  name: '1151',
	  value: 'queryPlayerFriendList',
	  param: [ 'uid' ]
	},
	{
	  name: '1152',
	  value: 'checkVersions',
	  param: [ 'server_version', 'client_version', 'client_silence_version' ]
	},
	{
	  name: '1153',
	  value: 'queryPlayerBriefData',
	  param: [ 'uid' ]
	},
	{
	  name: '1154',
	  value: 'queryPlayerExtraBinData',
	  param: [ 'uid' ]
	},
	{
	  name: '1155',
	  value: 'updatePlayerSecurityLevel',
	  param: [ 'uid', 'check_type', 'security_level' ]
	},
	{
	  name: '1156',
	  value: 'QueryPlayerRegPlatform',
	  param: [ 'uid' ]
	},
	{
	  name: '1157',
	  value: 'addFeatureSwitch',
	  param: [ 'id', 'type', 'msg' ]
	},
	{
	  name: '1158',
	  value: 'deleteFeatureSwitch',
	  param: [ 'id' ]
	},
	{
	  name: '1159',
	  value: 'setSignature',
	  param: [ 'uid', 'signature' ]
	},
	{
	  name: '1160',
	  value: 'addOrSubResin',
	  param: [ 'uid', 'delta_count', 'is_sub' ]
	},
	{
	  name: '1161',
	  value: 'setQuestGlobalVarValue',
	  param: [ 'uid', 'global_var_id', 'value' ]
	},
	{
	  name: '1162',
	  value: 'changeBindAccount',
	  param: [ 'account_id', 'uid', 'account_type' ]
	},
	{
	  name: '1163',
	  value: 'SetUserTag',
	  param: [ 'tag', 'uids (separated by ,)' ]
	},
	{
	  name: '1164',
	  value: 'batchBlockPlayerMp',
	  param: [ 'block_uid_list' ]
	},
	{
	  name: '1165',
	  value: 'batchUnblockPlayerMp',
	  param: [ 'unblock_uid_list (separated by ,)' ]
	},
	{
	  name: '1166',
	  value: 'queryPlayerMpBlockStatus',
	  param: [ 'uid' ]
	},
	{
	  name: '1167',
	  value: 'queryCrcSuspiciousList',
	  param: [ 'uid' ]
	},
	{
	  name: '1168',
	  value: 'addToCrcSuspiciousList',
	  param: [ 'uid_list', 'is_notify' ]
	},
	{
	  name: '1169',
	  value: 'removeFromCrcSuspiciousList',
	  param: [ 'uid_list' ]
	},
	{
	  name: '1170',
	  value: 'checkCrcVersions',
	  param: [ 'platform_type', 'client_version' ]
	},
	{
	  name: '1171',
	  value: 'forceAcceptQuest',
	  param: [ 'uid', 'quest_id' ]
	},
	{
	  name: '1172',
	  value: 'setMainCoopConfidence',
	  param: [ 'uid', 'confidence' ]
	},
	{
	  name: '1173',
	  value: 'addCoopPointSavePointList',
	  param: [ 'uid', 'coop_point_id', 'save_point_list', 'ticket' ]
	},
	{
	  name: '1174',
	  value: 'setFinishParentQuestChildQuestState',
	  param: [ 'uid', 'quest_id', 'state' ]
	},
	{
	  name: '1175',
	  value: 'setLevel1AreaExplorePoint',
	  param: [ 'uid', 'scene_id', 'level1_area_id', 'explore_point' ]
	},
	{
	  name: '1176',
	  value: 'setCodexOpenOrClose',
	  param: [ 'uid', 'codex_type', 'codex_id', 'is_open' ]
	},
	{
	  name: '1200',
	  value: 'addMcoinVipPoint',
	  param: [ 'uid', 'mcoin', 'vip_point', 'is_psn' ]
	},
	{
	  name: '1201',
	  value: 'getPlayerLoginPerSecond',
	  param: null
	},
	{
	  name: '1210',
	  value: 'getFineGrainedPlayerNum',
	  param: null
	},
	{
	  name: '1211',
	  value: 'removeGadgetInGroupByConfigId',
	  param: [ 'uid', 'scene_id', 'group_id', 'config_id' ]
	},
	{
	  name: '1212',
	  value: 'operateDelGadgetInGroupByConfigId',
	  param: [ 'uid', 'scene_id', 'group_id', 'config_id', 'is_add' ]
	},
	{
	  name: '1213',
	  value: 'operateGadgetStateInGroupByConfigId',
	  param: [
		'uid',
		'scene_id',
		'group_id',
		'config_id',
		'state',
		'is_create'
	  ]
	},
	{
	  name: '1214',
	  value: 'removeMonsterInGroupByConfigId',
	  param: [ 'uid', 'scene_id', 'group_id', 'config_id' ]
	},
	{
	  name: '1215',
	  value: 'operateDelMonsterInGroupByConfigId =>uid, scene_id, group_id, config_id, is_add',
	  param: null
	},
	{
	  name: '1216',
	  value: 'removeGroupTriggerByName',
	  param: [ 'uid', 'scene_id', 'group_id', 'trigger_name' ]
	},
	{
	  name: '1217',
	  value: 'setGroupTriggerCountByName',
	  param: [ 'uid', 'scene_id', 'group_id', 'trigger_name', 'trigger_count' ]
	},
	{
	  name: '1218',
	  value: 'setGroupVariableByName',
	  param: [ 'uid', 'scene_id', 'group_id', 'variable_name', 'value' ]
	},
	{
	  name: '1219',
	  value: 'setGroupTargetSuite',
	  param: [ 'uid', 'scene_id', 'group_id', 'target_suite' ]
	},
	{
	  name: '1220',
	  value: 'removeGroupOneoffByConfigId',
	  param: [ 'uid', 'scene_id', 'group_id', 'config_id', 'is_monster' ]
	},
	{
	  name: '1221',
	  value: 'finishRoutine',
	  param: [ 'uid', 'routine_id' ]
	}
]

const cmdMap = cmd.map((value) => {
	const newValue = {
		name: `${value.name}: ${value.value}`,
		value: value.name,
		param: value.param
	}
	return newValue
}, {})

console.log(cmdMap)