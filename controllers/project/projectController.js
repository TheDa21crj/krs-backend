const projectSchema = require("../../models/projectSchema");
const memberSchema = require("../../models/memberSchema");
const HttpError = require("../../models/HttpError");

const getProjects = async (req, res, next) => {
  var projects;
  try {
    projects = await projectSchema
      .find({})
      .populate("member", "_id name image")
      .sort({ date: "desc" })
      .lean();
    // members = await memberSchema.find({}).sort({ date: "desc" }).lean();
    // for (var i = 0; i < projects.length; i++) {
    //   for (var j = 0; j < projects[i].member.length; j++) {
    //     for (var k = 0; k < members.length; k++) {
    //       if (projects[i].member[j].toString() == members[k]._id.toString()) {
    //         projects[i].member[j] = {
    //           // members[k]._id,
    //           name: members[k].name,
    //           image: members[k].image,
    //           memberId: members[k]._id,
    //         };
    //       }
    //     }
    //   }
    // }
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ msg: "Error" });
    console.log(err);
  }
};

const addProject = async (req, res, next) => {
  try {
    const { name, description, link, image, member, tag } = req.body;

    if (res.locals.userData.userLevel == "admin") {
      let newProject;

      newProject = new projectSchema({
        name,
        description,
        link,
        image,
        member,
        tag,
      });
      try {
        console.log(newProject);
        const saveProject = await newProject.save();

        for (var i = 0; i < newProject.member.length; i++) {
          await memberSchema.findByIdAndUpdate(
            newProject.member[i],
            { $push: { project: newProject._id } },
            { new: true }
          );
        }

        res
          .status(200)
          .json({ success: true, data: saveProject._id.toString() });
      } catch (err) {
        console.log(err);
        const error = new HttpError("Cannot add project", 400);
        return next(error);
      }
    } else {
      const error = new HttpError("Access denied", 400);
      return next(error);
    }
  } catch (e) {
    res.status(500).json({ msg: "error" });
    console.log(err);
  }
};

const editProject = async (req, res, next) => {
  try {
    const projectId = req.params.pid;
    if (res.locals.userData.userLevel == "admin") {
      let project;
      try {
        project = await projectSchema.findById(projectId);
      } catch (err) {
        const error = new HttpError("Error finding project id ", 404);
        return next(error);
      }
      let name, description, link, image, member, tag;
      if (project) {
        ({ name, description, link, image, member, tag } = req.body);
        console.log(req.body);
      } else {
        const error = new HttpError("Project with this id not found", 404);
        return next(error);
      }
      var prevMem = [];
      for (var i = 0; i < project.member.length; i++) {
        prevMem.push(project.member[i].toString());
      }
      console.log("-------------");
      console.log(prevMem);
      var memberId = [];
      for (var i = 0; i < member.length; i++) {
        if (member[i].operation == "none") {
          for (var j = 0; j < prevMem.length; j++) {
            if (member[i].id == prevMem[j]) {
              memberId.push(member[i].id);
            }
          }
        }
        if (member[i].operation == "add") {
          memberId.push(member[i].id);
        }
      }
      project.name = name;
      project.description = description;
      project.link = link;
      project.image = image;
      project.member = memberId;
      project.tag = tag;
      try {
        await project.save();
        try {
          for (var i = 0; i < member.length; i++) {
            if (member[i].operation == "add") {
              await memberSchema.findByIdAndUpdate(
                member[i].id,
                { $push: { project: projectId } },
                { new: true }
              );
            } else if (member[i].operation == "delete") {
              await memberSchema.findByIdAndUpdate(
                member[i].id,
                { $pull: { project: projectId } },
                { new: true }
              );
            }
          }
        } catch (e) {
          console.log(e);
        }
        res.status(200).json({ success: true });
      } catch (err) {
        const error = new HttpError("Error saving the updated project", 401);
        console.log(err);
        return next(error);
      }
    } else {
      const error = new HttpError("Access denied", 400);
      return next(error);
    }
  } catch (e) {
    res.status(500).json({ msg: "error" });
    console.log(err);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const projectId = req.params.pid;

    if (res.locals.userData.userLevel == "admin") {
      try {
        const project = await projectSchema.findById(projectId);
        console.log(project);
        if (project) {
          await project.remove();

          res.status(200).json({ success: true, data: project._id.toString() });
          for (var i = 0; i < project.member.length; i++) {
            await memberSchema.findByIdAndUpdate(
              project.member[i],
              { $pull: { project: project._id } },
              { new: true }
            );
          }
        } else {
          const error = new HttpError("Project can't be deleted", 401);
          return next(error);
        }
      } catch (e) {}
    } else {
      const error = new HttpError("Access denied", 400);
      return next(error);
    }
  } catch (e) {
    res.status(500).json({ msg: "error" });
    console.log(err);
  }
};

exports.getProjects = getProjects;
exports.addProject = addProject;
exports.editProject = editProject;
exports.deleteProject = deleteProject;
