const createError = require('http-errors');
const User = require('../../models/User');
const Team = require('../../models/Team');
const utils = require('../../lib/utils');

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

exports.sendNoticeData = async (req, res, next) => {
  try {
    const { team_id } = req.params;
    const team = await Team.findById({ _id: team_id }).populate('members');
    res.json({ result: 'ok' , members: team.members });
  } catch(error) {
    next(createError(500));
  }
};

exports.sendTeamInvitation = async (req,res, next) => {
  try {
    const { email, teamname, id, token } = req.body;
    const VERIFY_URL = `http://localhost:3000/teams/${id}/join/${token}`;
    const mail = {
      to : `${email}`,
      from : "leodkwkej@gmail.com",
      subject: `${teamname} Team Invitation`,
      html: 
      `<div style="width:100%; height:200px; margin:auto;">
       <div style="width:60%; height:100%; background-color:#EAF4F4; margin-left: auto; margin-right: auto">
       <h2 style="text-align: center; margin:20px; padding-top: 20px;">${teamname}팀에 초대되셨습니다.</h2>
       <div style="width:60%; height:50%; margin-left: auto; margin-right: auto; background-color:white;">
       <h3 style="text-align: center;">팀 가입을 위해 아래 링크를 눌러주세요</h3>
       <p style="display:flex; align-items:center;">
       <a href="${VERIFY_URL}" style="text-decoration: none; ">해당 링크는 24시간 뒤에 만료됩니다.</a>
       </p>
       </div>
       </div>
      </div>`
    };

    await utils.mailer.sendMail(mail);
  } catch(e) {

  }
};