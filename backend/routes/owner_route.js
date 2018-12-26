const router = require("express").Router();

/*-----------Show Owner's Hotels Route------------*/
router.get("/", getOwnerHotels);
function getOwnerHotelsCB(req,res,result){
    let hotels = JSON.parse(result);
    res.render("pages/owner_show_hotels",{hotels: hotels,role: req.session.role});
}
function getOwnerHotels(req, res) {
    if(req.session.role !== "Owner"){
        console.log("Not Owner");
        res.redirect("/profile");
    }
    let params = req.session.username;
    console.log(params);
    console.log("OWNER HOTELS");
    query.hotelQueriesHandler.hotelSelect.GetOwnerHotels(req,res,params,getOwnerHotelsCB);
}
/*-------------------------------------------*/

/*-----------Show Owner's Hotel Rooms Route--------------*/
router.get("/:hotelName/:hotelBranch",showOwnerHotelRooms);
function showOwnerHotelRoomsCB(req,res,result){
    let rooms = JSON.parse(result);
    res.render("pages/owner_show_hotel",{rooms: rooms,role: req.session.role,
        hotelName: req.params.hotelName,
        hotelBranch: req.params.hotelBranch});
}
function showOwnerHotelRooms(req,res){
    let params = [req.params.hotelName,req.params.hotelBranch];
    query.roomQueriesHandler.roomSelectQuery.GetAllRooms(req,res,params,showOwnerHotelRoomsCB);
}
/*-------------------------------------------*/

/*-------------------Load Add Room Page--------------------*/
router.get("/:hotelName/:hotelBranch/addRoom",loadAddRoomPage);

function loadAddRoomPage(req,res){
    res.render("pages/owner_addRoom",{hotelName:req.params.hotelName,
        hotelBranch: req.params.hotelBranch,
        role: req.session.role});
}
/*---------------------------------------------------------*/
router.post("/:hotelName/:hotelBranch/addRoom",addRoom);
function addRoomCB(req,res){
    res.redirect("/owner/"+req.params.hotelName+"/"+req.params.hotelBranch);
}
function addRoom(req,res){
    let params = {
        Number: req.body.roomNumber,
        HotelBranch: req.params.hotelBranch,
        HotelName: req.params.hotelName,
        Type: req.body.type,
        Price: req.body.price
    };
    console.log(params.HotelBranch);
    console.log("Add Room");
    query.roomQueriesHandler.roomInsertQuery.AddRoom(req,res,params,addRoomCB);
}

/*------------Load Add Hotel Page Route----------------*/
router.get("/addHotel",loadAddHotelPage);
function loadAddHotelPage(req,res){
    res.render("pages/owner_addHotel",{role: req.session.role});
}
/*------------------------------------------------------*/

/*------------Add Hotel Request Route-------------------*/
router.post("/addHotel",addHotel);
function addHotelCB(req,res){
    res.redirect("/owner");
}
function addHotel(req,res){
    let params = {
        Name: req.body.hotelName,
        Branch: req.body.hotelBranch,
        Location: req.body.hotelLocation,
        OwnerUser: req.session.username,
        isPremium: req.body.Premium
    };
    console.log("Add Hotel");
    query.hotelQueriesHandler.hotelInsert.AddHotel(req,res,params,addHotelCB);
}
/*-------------------------------------------------------*/

/*-------------Load Edit Hotel Page Route----------------*/
router.get("/:hotelName/:hotelBranch/editHotel",loadEditHotelPage);
function loadEditHotelPage(req,res){
    res.render("pages/owner_editHotel",{hotelName:req.params.hotelName,hotelBranch:req.params.hotelBranch,
        role: req.session.role
    });
}
/*-------------------------------------------------------*/

/*------------Edit Hotel Route---------------------------*/
router.post("/:hotelName/:hotelBranch/editHotel",editHotel);
function editHotelCB(req,res,params){
    let hotelName = params[0].Name;
    let hotelBranch = params[0].Branch;
    console.log("Edit Hotel Call Back");
    res.redirect("/owner/"+hotelName+"/"+hotelBranch);
}

function editHotel(req,res){
    let hotelInfo = {
    };

    if(req.body.hotelName !== ""){
        hotelInfo.Name = req.body.hotelName;
    }

    if(req.body.hotelBranch !== ""){
        hotelInfo.Branch = req.body.hotelBranch;
    }

    if(req.body.hotelLocation !== ""){
        hotelInfo.Location = req.body.hotelLocation;
    }
    console.log("Updating Hotel");
    let params = [hotelInfo,req.params.hotelName,req.params.hotelBranch];
    query.hotelQueriesHandler.hotelUpdate.EditHotelInfo(req,res,params,editHotelCB);
}
module.exports = function(app) {
  app.use("/owner", router);
};
