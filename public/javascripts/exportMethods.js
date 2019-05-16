const Project = require('../../models/projectModel');
const Task = require('../../models/taskModel');
const Journal = require('../../models/journalModel');
const fs = require('fs');
const Builder = require('xmlbuilder');

module.exports = {

    /*export projects demanded in the checkbox form in CSV */
    exportProjectsCSV: async function (req,res) {

        var projectsArray = Object.keys(req.body); //array of ids of the selected projects
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
                    let information = projectsData[i].members[j].firstname
                        + ',' + projectsData[i].members[j].name
                        + ',' + projectsData[i].members[j].roles[0]
                        + '\r\n';
                    projectsMembers += information;
                }
                req.session.zipContent.push({content:projectsMembers, name:projectsData[i].name+'.csv'});
            }
            req.session.zipContent.push({content: projectsName, name:'projects.csv'}); //export the file to zipContent in the session

        }
    },

    /*export tasks demanded in the checkbox form in CSV */
    exportTasksCSV: async function (req,res) {

        var tasksData = await Task.find({_id:Object.keys(req.body)})
            .populate('project').populate('status')
            .catch((mongoError) => res.render('error',{error:mongoError}));//array of selected tasks
        if (tasksData != null) {
            /*write these tasks' information to a file*/
            var tasksInfo = 'name,startDate,dueDate,status,project,description\r\n';
            for (var i=0;i<tasksData.length;i++) {
                let information = tasksData[i].name
                    + ',' + tasksData[i].start_date
                    + ',' + tasksData[i].due_date
                    + ',' + tasksData[i].status.name
                    + ',' + tasksData[i].project.name
                    + ',' + tasksData[i].description
                    + '\r\n';
                tasksInfo += information;
                /*find the journals in this task*/
                let journalsData = await Journal.find({task:tasksData[i]._id}).populate('author')
                    .catch((mongoError) => res.render('error', {error: mongoError}));
                /*for each task, write the journals to a file*/
                var journalContents = 'date,author,entry\r\n';
                for (var j=0;j<journalsData.length;j++) {
                    let information = journalsData[j].date
                        + ',' + journalsData[j].author.name
                        + ',' + journalsData[j].entry
                        + '\r\n';
                    journalContents += information;
                }
                req.session.zipContent.push({content:journalContents, name:tasksData[i].name+'.csv'});
            }
            req.session.zipContent.push({content:tasksInfo, name:'tasks.csv'}); //export the file to zipContent in the session
        }
    },

    /*export the projects and the tasks demanded in the form in XML */
    exportXML: async function (req,res) {

        var xml = Builder.create('projects');//root node called projects
        var projectsData = await Project.find({_id:req.session.exportProjects})
            .populate('members').catch((mongoError) => res.render('error', {error: mongoError}));// find the selected projects
        /*for each project, write its information in the sub nodes*/
        for (var i = 0; i < projectsData.length; i++) {
            xml = xml.ele('project',{'name':projectsData[i].name});//create and go to the project node
            for (var j = 0; j <projectsData[i].members.length; j++) {
                xml.ele('member',{}, projectsData[i].members[j].name + ' ' + projectsData[i].members[j].firstname);
            }//member nodes belonging to project node

            var tasksData = await Task.find({_id:Object.keys(req.body),project:projectsData[i]._id})
                .populate('assignee').populate('status').catch((mongoError) => res.render('error',{error:mongoError}));
            /*the task nodes belong to the project node, and for each task, write its information in the sub nodes*/
            for (var j = 0; j < tasksData.length; j++) {
                xml = xml.ele('task',{'name':tasksData[j].name});//create and go to the task node
                xml.ele('status',{},tasksData[j].status.name);
                xml.ele('start_date',{},tasksData[j].start_date.toString());
                xml.ele('due_date',{},tasksData[j].due_date.toString());
                xml.ele('assignee',{},tasksData[j].assignee.name+' '+tasksData[j].assignee.firstname);
                xml.ele('description',{},tasksData[j].description);
                let journalsData = await Journal.find({task:tasksData[j]._id}).populate('author')
                    .catch((mongoError) => res.render('error', {error: mongoError}));
                /*the journal nodes belong to the task node, and for each journal, write its information in the sub nodes*/
                for (var k = 0; k < journalsData.length; k++) {
                    xml = xml.ele('journal',{'entry':journalsData[k].entry});//create and go to the journal node
                    xml.ele('date',{},journalsData[k].date.toString());
                    xml.ele('author',{},journalsData[k].author.name + ' ' +journalsData[k].author.firstname);
                    xml = xml.up(); //return to the parent node (task)
                }
                xml = xml.up(); //return to the parent node (project)
            }
            xml = xml.up(); //return to the parent node (projects)
        }
        var content = xml.end({pretty:true});
        console.log(content);
        req.session.zipContent.push({content:content, name:'projects.xml'}); //export the file to zipContent in the session
    },

    /*export the projects and the tasks demanded in the form in JSON */
    exportJSON:async function (req,res) {

        var projectsData = await Project.find({_id:req.session.exportProjects},'name members')
            .populate('members','-_id -__v -login -password')
            .catch((mongoError) => res.render('error', {error: mongoError})); //select projects and the useful information of projects
        var projectsDataClone = JSON.parse(JSON.stringify(projectsData)); //clone it to a new object
        for (var i=0; i<projectsData.length;i++) {
            var tasksData = await Task.find({_id:Object.keys(req.body),project:projectsData[i]._id},'-__v -project')
                .populate('assignee','-_id -__v -login -password').populate('status','-_id -__v')
                .catch((mongoError) => res.render('error',{error:mongoError})); //select tasks and the useful information
            projectsDataClone[i].tasks = JSON.parse(JSON.stringify(tasksData));//add tasks into the 'tasks' key
            for (var j=0; j<tasksData.length;j++) {
                var journalsData = await Journal.find({task:projectsDataClone[i].tasks[j]._id},'-task -_id -__v')
                    .populate('author','-_id -__v -login -password')
                    .catch((mongoError) => res.render('error', {error: mongoError}));// find journals and the useful information
                projectsDataClone[i].tasks[j].journals = JSON.parse(JSON.stringify(journalsData));//add the journals into the 'journals' key of tasks
            }
        }
        req.session.zipContent.push({content:JSON.stringify(projectsDataClone), name:'projects.json'}); //export the file to zipContent in the session

    }



};

