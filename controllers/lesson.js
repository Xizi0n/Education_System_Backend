const Lesson = require("../models/lesson");
const Course = require("../models/course");
const { handleValidationErrors } = require("../util/handleValidationErrors");

/////////////////////////////////////////////////////////////////////////
// Lesson
////////////////////////////////////////////////////////////////////////
module.exports.removeLesson = (req, res, next) => {
  const { lessonId, courseId } = req.body;
  handleValidationErrors(req);
  console.log("[lessonId]: ", lessonId);
  console.log("[courseId]:", courseId);

  Course.findById(courseId)
    .then(course => {
      if (course) {
        console.log(course.lessons instanceof Array);
        course.lessons = course.lessons.filter(
          lesson => lesson._id.toString() !== lessonId
        );
        console.log(course.lessons);
        return course.save();
      } else {
        const error = new Error(" No course was found!");
        error.statusCode = 404;
        next(error);
      }
    })
    .then(course => {
      Lesson.findByIdAndDelete(lessonId)
        .then(sucess => {
          console.log(sucess);
          res
            .status(200)
            .json({ message: "succesfully deleted", deleted: true });
        })
        .catch(err => console.log(err));
    });
};

module.exports.getLesson = (req, res, next) => {
  const { id } = req.params;
  Lesson.findById(id).then(lesson => {
    if (lesson) {
      res.status(200).json(lesson);
    }
  });
};

module.exports.updateLesson = (req, res, next) => {
  const { lessonId, updatedLesson } = req.body;
  handleValidationErrors(req);
  Lesson.findById(lessonId)
    .then(lesson => {
      if (lesson) {
        lesson
          .updateOne(updatedLesson)
          .then(result => {
            console.log(result);
          })
          .catch(err => console.log(err));
      }
    })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: "Succesful update" });
    })
    .catch(err => console.log(err));
};

module.exports.addLesson = (req, res, next) => {
  const { courseId, title, content } = req.body;
  console.log(courseId);
  //handleValidationErrors(req);

  const lesson = new Lesson({
    title: title,
    content: content
  });
  lesson
    .save()
    .then(lesson => {
      const loadedLesson = lesson;
      Course.findOne({ _id: courseId })
        .then(course => {
          console.log(course);
          course.lessons.push(lesson._id);
          return course.save();
        })
        .then(course => {
          res.status(200).json({ message: "Sucess" });
        });
    })

    .catch(err => console.log(err));
};
///////////////////////////////////////////////////////////////
// Exercise
//////////////////////////////////////////////////////////////
module.exports.addExercise = (req, res, next) => {
  const { lessonId, declaration, explanation, language, score } = req.body;
  Lesson.findOne({ _id: lessonId })
    .then(lesson => {
      console.log(lesson);
      lesson.exercises.push({
        declaration: declaration,
        explanation: explanation,
        language: language,
        score: score || null
      });
      return lesson.save();
    })
    .then(updatedLesson => {
      res.status(200).json({ message: "sucessfully added exercise" });
    })
    .catch(err => console.log(err));
};

module.exports.updateExercise = (req, res, next) => {
  const { lessonId, index, updatedExercise } = req.body;
  Lesson.findById(lessonId)
    .then(lesson => {
      if (lesson) {
        lesson.exercises[index].score = updatedExercise.score;
        lesson.exercises[index].declaration = updatedExercise.declaration;
        lesson.exercises[index].explanation = updatedExercise.explanation;
        lesson.exercises[index].language = updatedExercise.language;
        return lesson.save();
      } else {
        res.status(404).json({ messge: "not found" });
      }
    })
    .then(newLesson => {
      res.status(200).json(newLesson);
    })
    .catch(err => console.log(err));
};

module.exports.removeExercise = (req, res, next) => {
  const { exerciseId, lessonId } = req.body;
  Lesson.findById(lessonId)
    .then(lesson => {
      if (lesson) {
        lesson.exercises = lesson.exercises.filter(
          exercise => exercise._id.toString() !== exerciseId
        );
        return lesson.save();
      }
    })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: "succesfully deleted exercise" });
    })
    .catch(err => console.log(err));
};
