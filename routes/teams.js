const express = require('express');
const { verifyToken } = require('./middlewares/authentication');
const router = express.Router();
const teamsController = require('./controller/teams.controller');

router.get('/:team_id', verifyToken,  teamsController.sendTeamData);
router.post('/newteam', verifyToken, teamsController.addTeam);
router.post('/newnotice', verifyToken, teamsController.addNotice);

module.exports = router;
