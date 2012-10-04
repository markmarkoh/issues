define([], function() {
  return 'Hello from Yeoman!';
  gg.gitdata.getAllReferences(
    {
      user: "yeoman",
      "repo":"yeoman", ref="tags/v0.9pre3"}, function(err, msg) { console.log(err, msg); });
});