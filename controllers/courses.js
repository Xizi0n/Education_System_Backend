const Course = require("../models/course");
const Lesson = require("../models/lesson");
const { handleModifiers } = require("../util/utilities");

module.exports.addCourse = (req, res, next) => {
  const { name, icon } = req.body;

  const newCourse = new Course({
    name: name,
    icon: icon,
    creator: req.userId
  });
  newCourse
    .save()
    .then(course => {
      console.log(course);
      res.status(201).json({ message: "Succesfully saved course" });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

module.exports.getCourse = (req, res, next) => {
  console.log(req.params.id);
  const courseId = req.params.id;
  console.log(courseId);
  Course.findOne({ _id: courseId })
    .populate("lessons")
    .then(course => {
      console.log(course);
      res.status(200).json(course);
    })
    .catch(err => console.log(err));
};

module.exports.getCourses = (req, res, next) => {
  Course.find()
    .populate("lessons")
    .then(courses => {
      if (courses) {
        res.status(200).json(courses);
      }
    });
};

module.exports.removeCourse = (req, res, next) => {
  const { courseId } = req.body;

  Course.findById(courseId).then(course => {
    const loadedCourse = course;
    const deletePromises = [];
    course.lessons.forEach(lessonId =>
      deletePromises.push(Lesson.findByIdAndDelete(lessonId).exec())
    );
    Promise.all(deletePromises).then(result => {
      console.log("all sublessons deleted");
      course
        .remove()
        .then(result => {
          console.log(result);
          console.log("deleted course");
          res.status(200).json({ message: "sucessfully deleted" });
        })
        .catch(err => console.log(err));
    });
  });
};

module.exports.updateCourse = (req, res, next) => {
  let { courseId, updatedCourse } = req.body;
  Course.findById(courseId)
    .then(course => {
      console.log("COURSE: ", course);
      handleModifiers(course, updatedCourse, req);
      course
        .updateOne(updatedCourse)
        .then(updated => {
          console.log(updated);
          res.status(200);
        })
        .catch(err => console.log(err));
    })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: "Succesful course update" });
    })
    .catch(err => console.log(err));
};
