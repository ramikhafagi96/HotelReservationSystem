//File Responsible for Room Table Creation.
module.exports = function() {
  // query to create Room.
  conn.query(tableCreation.RoomTable, function(err, result) {
    CheckForError(err, result, "Room Table");
  });
};
