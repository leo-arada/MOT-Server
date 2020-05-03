const express = require('express');
const { verifyToken, verifyInvitationToken } = require('./middlewares/authentication');
const router = express.Router();
const teamsController = require('./controller/teams.controller');

router.get('/:team_id', verifyToken,  teamsController.sendTeamData);
router.get('/:team_id/members', verifyToken, teamsController.sendMembersData);
router.get('/:team_id/formation', verifyToken, teamsController.sendFormationdata);
router.post('/:team_id/formation', verifyToken, teamsController.saveFormationData);
router.get('/:team_id/posts', verifyToken, teamsController.sendPostData);
router.post('/:team_id/posts', verifyToken, teamsController.addNewPost);
router.put('/:team_id/posts/:post_id', verifyToken, teamsController.modifyPost);
router.delete('/:team_id/posts/:post_id', verifyToken, teamsController.deletePost);
router.post('/:team_id/posts/:post_id/like', verifyToken, teamsController.responseLikeRequest);
router.post('/newteam', verifyToken, teamsController.addTeam);
router.post('/:team_id/notice', verifyToken, teamsController.addNotice);
router.post('/:team_id/invitation', verifyToken, teamsController.sendTeamInvitation);
router.post('/:team:id/join/:token', verifyInvitationToken, teamsController.sendJoinResponse);
router.post('/posts/:post_id/comment', verifyToken, teamsController.addComment);
router.delete('/posts/:post_id/comment/:comment_id', verifyToken, teamsController.deleteComment);
router.get('/:team_id/match', verifyToken, teamsController.sendMatchData);
router.post('/:team_id/match', verifyToken, teamsController.saveMatch);
router.post('/:team_id/finance', verifyToken, teamsController.addFinance);

module.exports = router;  
