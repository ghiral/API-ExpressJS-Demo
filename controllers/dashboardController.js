module.exports.index = function (req,res){
    res.render('dashboard',{data:req,title:'Dashboard'});
}
