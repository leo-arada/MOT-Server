const createError = require('http-errors');
const User = require('../../models/User');
const Team = require('../../models/Team');
const Notice = require('../../models/Notice');


exports.addTeam = async (req, res, next) => {
  try {
    const { teamName, email } = req.body;
    let team = await Team.findOne({ name: teamName });
    if (team) return res.json({ result: 'duplicated' });
    const user = await User.findOne({ email });
    team = await new Team({
      name: teamName,
      members: [user._id],
      admin: user._id,
    }).save();
    user.teams.push(team._id);
    await user.save();
    res.json({ result: 'ok', team });
  } catch (error) {
    next(createError(500));
  }
};

exports.sendTeamData = async (req, res, next) => {
  try {
    const { team_id } = req.params;
    const team = await Team.findById({ _id: team_id });
    res.json({ result: 'ok' , team });
  } catch(error) {
    next(createError(500));
  }
};

exports.addNotice = async (req, res, next) => {
  try{
    const { notice, teamname } = req.body;
    const team = await Team.findOne({ name: teamname });
    team.notices.push(notice);
    await team.save();
    res.json({ result: 'ok' });
  } catch(e) {
    next(createError(500));
  }
};
