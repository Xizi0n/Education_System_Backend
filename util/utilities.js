module.exports.handleModifiers = (original, obj, req) => {
  obj.modifiers = original.modifiers;
  if (Object.keys(obj).includes("modifiers")) {
    console.log("OBJ:MODIFIERS TRUE");
    if (!obj.modifiers.includes(req.userId)) {
      obj.modifiers = original.modifiers;
      obj.modifiers.push(req.userId);
    }
  } else {
    obj.modifiers = [];
    obj.modifiers.push(req.userId);
  }
  return obj;
};
