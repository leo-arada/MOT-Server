const express = require('express');
const { verifyToken, verifyInvitationToken } = require('./middlewares/authentication');
const router = express.Router();
const teamsController = require('./controller/teams.controller');

router.get('/myteam/:team_id', verifyToken,  teamsController.sendTeamData);
router.get('/myteam/:team_id/members', verifyToken, teamsController.sendMembersData);
router.post('/newteam', verifyToken, teamsController.addTeam);
router.post('/myteam/:team_id/notice', verifyToken, teamsController.addNotice);
router.post('/:team_id/invitation', verifyToken, teamsController.sendTeamInvitation);
router.post('/:team:id/join/:token', verifyInvitationToken, teamsController.sendJoinResponse);

module.exports = router;
