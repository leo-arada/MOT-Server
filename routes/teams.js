const express = require('express');
const { verifyToken, verifyInvitationToken } = require('./middlewares/authentication');
const router = express.Router();
const teamsController = require('./controller/teams.controller');

router.get('/myteam/:team_id', verifyToken,  teamsController.sendTeamData);
router.get('/myteam/:team_id/members', verifyToken, teamsController.sendMembersData);
router.get('/myteam/:team_id/formation', verifyToken, teamsController.sendFormationdata);
router.post('/myteam/:team_id/formation', verifyToken, teamsController.saveFormationData);
router.get('/myteam/:team_id/posts', verifyToken, teamsController.sendPostData);
router.post('/myteam/:team_id/posts', verifyToken, teamsController.addNewPost);
router.put('/myteam/:team_id/posts/:post_id', verifyToken, teamsController.modifyPost);
router.delete('/myteam/:team_id/posts/:post_id', verifyToken, teamsController.deletePost);
router.post('/myteam/:team_id/posts/:post_id/like', verifyToken, teamsController.responseLikeRequest);
router.post('/newteam', verifyToken, teamsController.addTeam);
router.post('/myteam/:team_id/notice', verifyToken, teamsController.addNotice);
router.post('/:team_id/invitation', verifyToken, teamsController.sendTeamInvitation);
router.post('/:team:id/join/:token', verifyInvitationToken, teamsController.sendJoinResponse);

module.exports = router;
