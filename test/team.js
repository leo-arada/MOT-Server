const { expect } = require('chai');
const app = require('../app');
const request = require('supertest');
const User = require('../models/User');
const Team = require('../models/Team');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Finance = require('../models/Finance');

const fakeToken = 'WinterIsComing';
const login = '/auth/login';
const testUser = {
  email: 'login@naver.com',
  password: '11231123',
};

let accessToken;

describe('/newteam', function() {
  const addTeam = '/teams/newteam';
  const testTeam = {
    teamName: '리엑트',
    email: 'login@naver.com',
  };
  
  const existingTeam = {
    teamName: '자바스크립트',
    email: 'login@naver.com',
  };

  let teamId;

  before((done) => {
    this.timeout(5000);
    request(app)
      .post(login)
      .send(testUser)
      .end((err, res) => {
        const { token } = res.body;
        accessToken = token;
        done();
      });
  });

  after(async () => {
    await User.findOneAndUpdate(
      { email: 'login@naver.com' },
      { $pull: { teams: { $in: [teamId] } } },
      { new: true }
    );
    await Team.findByIdAndDelete({ _id: teamId });
  });

  it('Should send a team data when the team was created', function(done) {
    this.timeout(10000);
    request(app)
      .post(addTeam)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(testTeam)
      .end(async (err, res) => {
        const { team } = res.body;
        teamId = team._id;
        const user = await User.findOne({ email: testUser.email });
        const TEAM = user.teams.find(
          (id) => id.toString() === team._id.toString()
        );
        expect(team.name).to.equal('리엑트');
        expect(res.status).to.equal(200);
        expect(TEAM.toString()).to.equal(team._id.toString());
        done();
      });
  });

  it('Should send 409 status when the team already exists', function(done) {
    this.timeout(10000);
    request(app)
      .post(addTeam)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(existingTeam)
      .end((err, res) => {
        expect(res.status).to.equal(409);
        done();
      });
  });
});

describe('/:team_id', function() {
  const teamId = '5eb032ef5f67343e402c088a';
  const getTeamData = `/teams/${teamId}`;
  const existingTeamName = '자바스크립트';

  before((done) => {
    this.timeout(5000);
    request(app)
      .post(login)
      .send(testUser)
      .end((err, res) => {
        const { token } = res.body;
        accessToken = token;
        done();
      });
  });

  it('Should send team data with 200 status with the valid token', function(done) {
    this.timeout(10000);
    request(app)
      .get(getTeamData)
      .set('Authorization', `Bearer ${accessToken}`)
      .end((err, res) => {
        const { team, result } = res.body;
        expect(result).to.equal('ok');
        expect(team.name).to.equal(existingTeamName);
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('Should get 401 status when the token is wrong', function(done) {
    this.timeout(10000);
    request(app)
      .get(getTeamData)
      .set('Authorization', `Bearer ${fakeToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
  });
});

describe('/:team_id/invitation', function() {
  const teamId = '5eb032ef5f67343e402c088a';
  const data = { 
    email: 'login@naver.com', 
    teamname: '자바스크립트', 
    id: teamId
  };
 
  const getInvitaion = `/teams/${teamId}/invitation`;

  before((done) => {
    this.timeout(5000);
    request(app)
      .post(login)
      .send(testUser)
      .end((err, res) => {
        const { token } = res.body;
        accessToken = token;
        done();
      });
  });

  it('Should send an invitation', function(done) {
    this.timeout(10000);
    request(app)
      .post(getInvitaion)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(data)
      .end((err, res) => {
        const { result } = res.body;
        expect(result).to.equal('ok');
        expect(res.status).to.equal(200);
        done();
      });
  });
});

describe('/:team_id/members', function() {
  const teamId = '5eb03b02aa17dc0488c564bf';
  const getMembersData = `/teams/${teamId}/members`;

  before((done) => {
    this.timeout(5000);
    request(app)
      .post(login)
      .send(testUser)
      .end((err, res) => {
        const { token } = res.body;
        accessToken = token;
        done();
      });
  });

  it('Should get members data', function(done) {
    this.timeout(10000);
    request(app)
      .get(getMembersData)
      .set('Authorization', `Bearer ${accessToken}`)
      .end((err, res) => {
        const { result, members } = res.body;
        const isUserinMembers = members.some(
          (member) => member.email === testUser.email
        );
        expect(result).to.equal('ok');
        expect(res.status).to.equal(200);
        expect(isUserinMembers).to.be.ok;
        done();
      });
  });
});

describe('/:team_id/formation', function() {
  const teamId = '5eb03b02aa17dc0488c564bf';
  const addFormation = `/teams/${teamId}/formation`;
  const data = [
    { innerText: '론', marginLeft: '100', marginTop: '100' },
    { innerText: '헤르미온느', marginLeft: '50', marginTop: '50' },
  ];

  before((done) => {
    this.timeout(5000);
    request(app)
      .post(login)
      .send(testUser)
      .end((err, res) => {
        const { token } = res.body;
        accessToken = token;
        done();
      });
  });

  after(async () => {
    await Team.findByIdAndUpdate(
      { _id: teamId }, 
      { formation: [] }, 
      { new: true }
    );
  });

  it('Should add formation', function(done) {
    this.timeout(10000);
    request(app)
      .post(addFormation)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(data)
      .end(async (err, res) => {
        const { result } = res.body;
        const team = await Team.findById({ _id: teamId });
        expect(team.formation.length).to.equal(2);
        expect(result).to.equal('ok');
        done();
      });
  });

  it('Should get formation data', function(done) {
    this.timeout(10000);
    request(app)
      .get(addFormation)
      .set('Authorization', `Bearer ${accessToken}`)
      .end((err, res) => {
        const { result, formation } = res.body;
        expect(formation.length).to.equal(2);
        expect(result).to.equal('ok');
        done();
      });
  });
});

describe('/:team_id/posts AND /posts/:post_id/comment', function() {
  const teamId = '5eb03b02aa17dc0488c564bf';
  const addPost = `/teams/${teamId}/posts`;
  const data = {
    post: {
      name: '지니',
      poster: '5eb02fa565b2cf3dc8bf53a0',
      content: '오늘 해리포터보자!',
      date: '2010-01-05',
    },
    teamId,
  };

  const content = {
    name: '지니',
    poster: '5eb02fa565b2cf3dc8bf53a0',
    content: '해리포터말고 반지의제왕!',
    date: '2010-01-05',
  };

  let postId;
  let commentId;

  before((done) => {
    this.timeout(5000);
    request(app)
      .post(login)
      .send(testUser)
      .end((err, res) => {
        const { token } = res.body;
        accessToken = token;
        done();
      });
  });

  it('Should add post', function(done) {
    this.timeout(10000);
    request(app)
      .post(addPost)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(data)
      .end(async (err, res) => {
        const { result, newPost } = res.body;
        postId = newPost._id;
        const team = await Team.findById({ _id: teamId });
        expect(team.forum[0].toString()).to.equal(postId.toString());
        expect(result).to.equal('ok');
        done();
      });
  });
  
  it('Should get forum data', function(done) {
    this.timeout(10000);
    request(app)
      .get(addPost)
      .set('Authorization', `Bearer ${accessToken}`)
      .end((err, res) => {
        const { result, forum } = res.body;;
        expect(forum.length).to.equal(1);
        expect(result).to.equal('ok');
        done();
      });
  });

  it('Should change post', function(done) {
    const modifyPost = `/teams/${teamId}/posts/${postId}`;

    this.timeout(10000);
    request(app)
      .put(modifyPost)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(content)
      .end(async (err, res) => {
        const { result } = res.body;
        const post = await Post.findById({ _id: postId });
        expect(post.content).to.equal('해리포터말고 반지의제왕!');
        expect(result).to.equal('ok');
        done();
      });
  });

  const likeData = {
    userId: '5eb02fa565b2cf3dc8bf53a0',
  };

  it('Should increase length of likes ', function(done) {
    const likePost = `/teams/${teamId}/posts/${postId}/like`;
  
    this.timeout(10000);
    request(app)
      .post(likePost)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(likeData)
      .end((err, res) => {
        const { result, likes } = res.body;
        expect(likes.length).to.equal(1);
        expect(likes[0].toString()).to.equal(likeData.userId);
        expect(result).to.equal('ok');
        done();
      });
  });

  it('Should decreae length of likes when user has already liked the post', function(done) {
    const likePost = `/teams/${teamId}/posts/${postId}/like`;

    this.timeout(10000);
    request(app)
      .post(likePost)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(likeData)
      .end(async (err, res) => {
        const { result, likes } = res.body;
        expect(likes.length).to.equal(0);
        expect(result).to.equal('ok');
        done();
      });
  });

  it('Should add a new comment', function(done) {
    const addComment = `/teams/posts/${postId}/comment`;
    const commentData = {
      content: '답글이 없네 아무도..',
      name: '지니',
      writer: '5eb02fa565b2cf3dc8bf53a0',
      postId,
    };

    this.timeout(10000);
    request(app)
      .post(addComment)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(commentData)
      .end(async (err, res) => {
        const { result, comment } = res.body;
        commentId = comment._id;
        const post = await Post.findById({ _id: postId });
        expect(comment.name).to.equal('지니');
        expect(comment.content).to.equal('답글이 없네 아무도..');
        expect(post.comments.length).to.equal(1);
        expect(post.comments[0].toString()).to.equal(comment._id);
        expect(result).to.equal('ok');
        done();
      });
  });

  it('Should delete a comment', function(done) {
    const deleteComment = `/teams/posts/${postId}/comment/${commentId}`;

    this.timeout(10000);
    request(app)
      .delete(deleteComment)
      .set('Authorization', `Bearer ${accessToken}`)
      .end(async (err, res) => {
        const { result } = res.body;
        const post = await Post.findById({ _id: postId });
        const comment = await Comment.findById({ _id: commentId });
        expect(comment).to.equal(null);
        expect(post.comments.length).to.equal(0);
        expect(result).to.equal('ok');
        done();
      });
  });

  it('Should delete a post', function(done) {
    const deletePost = `/teams/${teamId}/posts/${postId}`;

    this.timeout(10000);
    request(app)
      .delete(deletePost)
      .set('Authorization', `Bearer ${accessToken}`)
      .end(async (err, res) => {
        const { result } = res.body;
        const post = await Post.findById({ _id: postId });
        const forum = await Team.find({ forum: { $in: [postId] } });
        const comments = await Comment.find({ postId });
        expect(comments.length).to.equal(0);
        expect(post).to.equal(null);
        expect(forum.length).to.equal(0);
        expect(result).to.equal('ok');
        done();
      });
  });
});

describe('/:team_id/notice', function() {
  const teamId = '5eb03b02aa17dc0488c564bf';
  const addNotice = `/teams/${teamId}/notice`;
  const data = {
    notice: {
      content: '오늘 일정은 해리포터 감상입니다',
      date: '2020-05-05',
    },
    teamname: '해리포터',
  };

  before((done) => {
    this.timeout(5000);
    request(app)
      .post(login)
      .send(testUser)
      .end((err, res) => {
        const { token } = res.body;
        accessToken = token;
        done();
      });
  });

  after(async () => {
    await Team.findByIdAndUpdate(
      { _id: teamId }, 
      { notices: [] }, 
      { new: true }
    );
  });

  it('Should add a new notice', function(done) {
    this.timeout(10000);
    request(app)
      .post(addNotice)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(data)
      .end(async (err, res) => {
        const { result } = res.body;
        const team = await Team.findById({ _id: teamId });
        expect(team.notices[0].content).to.equal(
          '오늘 일정은 해리포터 감상입니다'
        );
        expect(result).to.equal('ok');
        done();
      });
  });
});

describe('/:team_id/match', function() {
  const teamId = '5eb03b02aa17dc0488c564bf';
  const saveMatch = `/teams/${teamId}/match`;
  const data = {
    date: '2012-02-03',
    time:'17:00',
    opponent: '말포이',
    location: ['30', '30'],
  };

  before((done) => {
    this.timeout(5000);
    request(app)
      .post(login)
      .send(testUser)
      .end((err, res) => {
        const { token } = res.body;
        accessToken = token;
        done();
      });
  });

  after(async () => {
    await Team.findByIdAndUpdate(
      { _id: teamId }, 
      { match: [] }, 
      { new: true }
    );
  });

  it('Should add a new notice', function(done) {
    this.timeout(10000);
    request(app)
      .post(saveMatch)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(data)
      .end(async (err, res) => {
        const { result } = res.body;
        const team = await Team.findById({ _id: teamId });
        expect(team.match[0].opponent).to.equal('말포이');
        expect(team.match[0].time).to.equal('17:00');
        expect(result).to.equal('ok');
        done();
      });
  });

  it('Should get match data', function(done) {
    this.timeout(10000);
    request(app)
      .get(saveMatch)
      .set('Authorization', `Bearer ${accessToken}`)
      .end(async (err, res) => {
        const { result, match } = res.body;
        expect(match[0].opponent).to.equal('말포이');
        expect(match[0].time).to.equal('17:00');
        expect(result).to.equal('ok');
        done();
      });
  });
});

describe('/:team_id/finance', function() {
  const teamId = '5eb03b02aa17dc0488c564bf';
  const saveFinance = `/teams/${teamId}/finance`;
  const data = {
    yearAndMonth: '2010-05',
    income: '50000',
    outcome: '50000',
    fieldFee: '30000',
    foodFee: '10000',
    equipmentFee: '10000',
    ect: '0',
  };

  let financeId;

  before((done) => {
    this.timeout(5000);
    request(app)
      .post(login)
      .send(testUser)
      .end((err, res) => {
        const { token } = res.body;
        accessToken = token;
        done();
      });
  });

  after(async () => {
    await Team.findByIdAndUpdate(
      { _id: teamId }, 
      { finances: [] }, 
      { new: true }
    );
  });

  it('Should add a new finance', function(done) {
    this.timeout(10000);
    request(app)
      .post(saveFinance)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(data)
      .end(async (err, res) => {
        const { result, newFinances } = res.body;
        console.log(result, newFinances)
        financeId = newFinances[0]._id;
        const team = await Team.findById({ _id: teamId });
        expect(team.finances[0]._id.toString()).to.equal(newFinances[0]._id.toString());
        expect(newFinances[0].yearAndMonth).to.equal('2010-05');
        expect(newFinances[0].income).to.equal('50000');
        expect(newFinances[0].outcome).to.equal('50000');
        expect(result).to.equal('ok');
        done();
      });
  });

  it('Should delete a finance', function(done) {
    const deleteFinance = `/teams/${teamId}/finance/${financeId}`;

    this.timeout(10000);
    request(app)
      .delete(deleteFinance)
      .set('Authorization', `Bearer ${accessToken}`)
      .end(async (err, res) => {
        const { result } = res.body;
        const team = await Team.findById({ _id: teamId });
        const finance = await Finance.findById({ _id: financeId});
        expect(team.finances.length).to.equal(0);
        expect(finance).to.equal(null);
        expect(result).to.equal('ok');
        done();
      });
  });
});
