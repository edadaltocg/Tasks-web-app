const Project = require('../../models/projectModel');
const Task = require('../../models/taskModel');
const Journal = require('../../models/journalModel');
const fs = require('fs');

module.exports = {

    /*export projects demanded in the checkbox form*/
    exportProjectsCSV: async function (req,res) {

        var projectsArray = Object.keys(req.body);
        var projectsData = await Project.find({_id:projectsArray})
            .populate('members').catch((mongoError) => res.render('error', {error: mongoError}));

        if (projectsData == null) {
            res.send('no project found');
        } else {
            /*write these projects' names to a file*/
            var projectsName = 'name\r\n';
            for (var i = 0; i < projectsData.length; i++) {
                let information = projectsData[i].name + '\r\n';
                projectsName += information;
                /*for each project, write the members' names to a file*/
                var projectsMembers = 'firstname,name,roles\r\n';
                for (var j = 0; j < projectsData[i].members.length; j++) {
                    let information = projectsData[i].members[j].firstname + ',' + projectsData[i].members[j].name + ',' + projectsData[i].members[j].roles[0] + '\r\n';
                    projectsMembers += information;
                }
                req.session.zipContent.push({content:projectsMembers, name:projectsData[i].name+'.csv'});
            }
            req.session.zipContent.push({content: projectsName, name:'projects.csv'});

        }
    },


    exportTasksCSV: async function (req,res) {

        /*export tasks demanded in the checkbox form*/
        var tasksData = await Task.find({_id:Object.keys(req.body)})
            .populate('project').populate('status').catch((mongoError) => res.render('error',{error:mongoError}));
        if (tasksData != null) {
            /*write these tasks' names to a file*/
            var tasksName = 'name,startDate,dueDate,status,project,description\r\n';
            for (var i=0;i<tasksData.length;i++) {
                let information = tasksData[i].name + ',' + tasksData[i].start_date + ',' + tasksData[i].due_date + ',' + tasksData[i].status.name + ',' + tasksData[i].project.name + ',' + tasksData[i].description + '\r\n';
                tasksName += information;
                /*find the journals in this task*/
                let journalsData = await Journal.find({task:tasksData[i]._id}).populate('author').catch((mongoError) => res.render('error', {error: mongoError}));
                /*for each task, write the journals to a file*/
                var journalContents = 'date,author,entry\r\n';
                for (var j=0;j<journalsData.length;j++) {
                    let information = journalsData[j].date + ',' + journalsData[j].author.name + ',' + journalsData[j].entry + '\r\n';
                    journalContents += information;
                }
                req.session.zipContent.push({content:journalContents, name:tasksData[i].name+'.csv'});
            }
            req.session.zipContent.push({content:tasksName, name:'tasks.csv'});
        }
    }



};

