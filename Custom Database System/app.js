let port = 44000;
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let fs = require('fs'); 

const ipman = "35.233.57.207"; //localhost

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/invoices', express.static(__dirname + '/invoices'));

//BASIC CALL__________________________________________________________________________________________
app.get('/', function(req, res){
	res.send("This is the app.js server, a kind of a backup and also for testing a few things. ");
});

//SHOW INFORMATION ABOUT A ROOM______________________________________________________________________________________
app.get('/hotels/:location/:hotel/rooms/:roomid', (req, res) => {
    const location = req.params.location;
    const hotel = req.params.hotel;
    const filePath = `${location}/${hotel}.json`;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send(`Error reading ${hotel}.json file`);
            return;
        }
        let rooms = JSON.parse(data);
        res.send(rooms[req.params.roomid]);
    });
});


//SHOW ALL ROOMS______________________________________________________________________________________
app.get('/hotels/:location/:hotel/rooms', (req, res) => {
    const location = req.params.location;
    const hotel = req.params.hotel;
    const filePath = `${location}/${hotel}.json`;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send(`Error reading ${hotel}.json file`);
            return;
        }
        let rooms = JSON.parse(data);
        res.send(rooms);
        // res.send(rooms.filter(roomid => rooms[roomid].status === "free"));
    });
});


//MULTIPLE PARAMS
app.put('/hotels/:location/:hotel/rooms/:roomids', (req, res) => {


    const location = req.params.location;
    const hotel = req.params.hotel;
    const roomids = req.params.roomids.split(','); // Split the room IDs by comma
    const filePath = `${location}/${hotel}.json`;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send(`Error reading the file ${hotel}.json`);
            return;
        }
        
        let rooms = JSON.parse(data);
        let change = req.body;

        roomids.forEach(roomid => {
            if (rooms[roomid]) {
                if (change.status === "free") {
                    rooms[roomid].guest = "none";
                    rooms[roomid].status = "free";
                    rooms[roomid].checkOut = "2024-03-19";
                } else if (change.status === "occupied" && change.guest !== undefined) {
                    rooms[roomid].guest = change.guest;
                    rooms[roomid].status = "occupied";
                    rooms[roomid].checkOut = change.checkOut;
                } else {
                    res.status(400).send(`Invalid status or missing guest information for room ${roomid}`);
                    return;
                }
            } else {
                res.status(404).send(`Room ID ${roomid} not found`);
                return;
            }
        });

        fs.writeFile(filePath, JSON.stringify(rooms, null, 2), (err) => {
            if (err) {
                res.status(500).send(`Error writing the file ${hotel}.json`);
                return;
            }
            res.sendStatus(200);
        });
    });
});


// //PUT METHOD TO ACCEPT THE ARRAYS____________________________________________________________________
// app.put('/hotels/:location/:hotel/rooms', (req, res) => {

//     console.log("PUT Working!");

//     const location = req.params.location;
//     const hotel = req.params.hotel;
//     const filePath = `${location}/${hotel}.json`;



//     fs.readFile(filePath, 'utf8', (err, data) => {
//         if (err) {
//             res.status(500).send(`Error reading the file ${hotel}.json`);
//             return;
//         }
//         let rooms = JSON.parse(data);
//         let changes = req.body;

//         if (!Array.isArray(changes)) {
//             res.status(400).send("Request body must be an array of room changes");
//             return;
//         }

//         for (let change of changes) {
//             const roomid = change.roomid;

//             if (!roomid || !rooms[roomid]) {
//                 res.status(400).send(`Invalid room id: ${roomid}`);
//                 return;
//             }

//             if (change.status === "free") {
//                 rooms[roomid].guest = "none";
//                 rooms[roomid].status = "free";
//             } else if (change.status === "occupied" && change.guest !== undefined) {
//                 rooms[roomid].guest = change.guest;
//                 rooms[roomid].status = "occupied";
//             } else {
//                 res.status(400).send(`Invalid status or missing guest for room id: ${roomid}`);
//                 return;
//             }
//         }

//         fs.writeFile(filePath, JSON.stringify(rooms, null, 2), (err) => {
//             if (err) {
//                 res.status(500).send(`Error writing the file ${hotel}.json`);
//                 return;
//             }
//             res.sendStatus(200);
//         });      
//     });
// });
//____________________________________________________________________________________________________

// //PUT METHOD-----------------------------------------------------------------
// app.put('/hotels/:location/:hotel/rooms/:roomid', (req, res) => {
//     const location = req.params.location;
//     const hotel = req.params.hotel;
//     const roomid = req.params.roomid;
//     const filePath = `${location}/${hotel}.json`;

//     fs.readFile(filePath, 'utf8', (err, data) => {
//         if (err) {
//             res.status(500).send(`Error reading the file ${hotel}.json`);
//             return;
//         }
//         let rooms = JSON.parse(data);
        
//         let change = req.body;
        
//         if (change.status === "free") {
//             rooms[roomid].guest = "none";
//             rooms[roomid].status = "free";
//         } else if (change.status === "occupied" && change.guest !== undefined) {
//             rooms[roomid].guest = change.guest;
//             rooms[roomid].status = "occupied";
//         } else {
//             res.sendStatus(400);
//             return;
//         }
        
//         fs.writeFile(filePath, JSON.stringify(rooms, null, 2), (err) => {
//             if (err) {
//                 res.status(500).send(`Error writing the file ${hotel}.json`);
//                 return;
//             }
//             res.sendStatus(200);
//         });
//     });
// });



//SHOW ALL FREE ROOMS______________________________________________________________________________________
app.get('/hotels/:location/:hotel/rooms/available/plus', (req, res) => {
    
    const location = req.params.location;
    const hotel = req.params.hotel;
    const filePath = `${location}/${hotel}.json`;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send(`Error reading ${hotel}.json file`);
            return;
        }
        let rooms = JSON.parse(data);
        let freeRooms = Object.keys(rooms).filter(roomId =>  rooms[roomId].status === "free");
        res.send(freeRooms);
    });
});

// //SHOW ALL FREE SINGLE ROOMS______________________________________________________________________________________
// app.get('/hotels/:location/:hotel/rooms/single/free', (req, res) => {
//     const location = req.params.location;
//     const hotel = req.params.hotel;
//     const filePath = `${location}/${hotel}.json`;

//     fs.readFile(filePath, 'utf8', (err, data) => {
//         if (err) {
//             res.status(500).send(`Error reading ${hotel}.json file`);
//             return;
//         }
//         let rooms = JSON.parse(data);
//         let freeRooms = Object.keys(rooms).filter(roomId =>  rooms[roomId].roomtype === "single" && rooms[roomId].status === "free");
//         res.send(freeRooms);
//     });
// });

//FREE SINGLE ROOMS WITH DATE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
app.get('/hotels/:location/:hotel/rooms/single/free', (req, res) => {
    const location = req.params.location;
    const hotel = req.params.hotel;
    const filePath = `${location}/${hotel}.json`;
    const userDate = req.query.userDate; // Assuming the query parameter is named 'userDate'

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send(`Error reading ${hotel}.json file`);
            return;
        }

        let rooms = JSON.parse(data);

        // Filter rooms based on roomtype, status, and checkOut date
        let freeSingleRooms = Object.keys(rooms).filter(roomId => {
            return rooms[roomId].roomtype === "single" &&
                   rooms[roomId].status === "free" &&
                   rooms[roomId].checkOut < userDate; // Assuming checkOut is in "YYYY-MM-DD" format
        });

        res.send(freeSingleRooms);
    });
});

//FREE DOUBLE ROOMS WITH DATE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
app.get('/hotels/:location/:hotel/rooms/double/free', (req, res) => {
    const location = req.params.location;
    const hotel = req.params.hotel;
    const filePath = `${location}/${hotel}.json`;
    const userDate = req.query.userDate; // Assuming the query parameter is named 'userDate'

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send(`Error reading ${hotel}.json file`);
            return;
        }

        let rooms = JSON.parse(data);

        // Filter rooms based on roomtype, status, and checkOut date
        let freeSingleRooms = Object.keys(rooms).filter(roomId => {
            return rooms[roomId].roomtype === "double" &&
                   rooms[roomId].status === "free" &&
                   rooms[roomId].checkOut < userDate; // Assuming checkOut is in "YYYY-MM-DD" format
        });

        res.send(freeSingleRooms);
    });
});

//FREE SUITE ROOMS WITH DATE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
app.get('/hotels/:location/:hotel/rooms/suite/free', (req, res) => {
    const location = req.params.location;
    const hotel = req.params.hotel;
    const filePath = `${location}/${hotel}.json`;
    const userDate = req.query.userDate; // Assuming the query parameter is named 'userDate'

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send(`Error reading ${hotel}.json file`);
            return;
        }

        let rooms = JSON.parse(data);

        // Filter rooms based on roomtype, status, and checkOut date
        let freeSingleRooms = Object.keys(rooms).filter(roomId => {
            return rooms[roomId].roomtype === "suite" &&
                   rooms[roomId].status === "free" &&
                   rooms[roomId].checkOut < userDate; // Assuming checkOut is in "YYYY-MM-DD" format
        });

        res.send(freeSingleRooms);
    });
});




// // SHOW ALL FREE SINGLE ROOMS AFTER A GIVEN DATE
// app.get('/hotels/:location/:hotel/rooms/single/free', (req, res) => {
//     const location = req.params.location;
//     const hotel = req.params.hotel;
//     const filePath = `${location}/${hotel}.json`;

//     console.log(`Reading file from: ${filePath}`);

//     // Get the date from query parameters
//     const { date } = req.query;
//     let userDate;

//     if (date) {
//         // Convert the user-provided date to a Date object
//         userDate = new Date(date);

//         // Check for invalid date
//         if (isNaN(userDate.getTime())) {
//             return res.status(400).json({ error: 'Invalid date format.' });
//         }
//     }

//     fs.readFile(filePath, 'utf8', (err, data) => {
//         if (err) {
//             console.error(`Error reading ${filePath}:`, err);
//             return res.status(500).send(`Error reading ${hotel}.json file`);
//         }
//         let rooms;
//         try {
//             rooms = JSON.parse(data);
//         } catch (parseError) {
//             console.error('Error parsing JSON:', parseError);
//             return res.status(500).send('Error parsing JSON data.');
//         }

//         // Filter rooms that are single and free
//         let freeSingleRooms = Object.keys(rooms).filter(roomId => {
//             let room = rooms[roomId];
//             let isSingleFree = room.roomtype === "single" && room.status === "free";
//             if (userDate) {
//                 return isSingleFree && new Date(room.availableFrom) > userDate;
//             }
//             return isSingleFree;
//         });

//         res.send(freeSingleRooms);
//     });
// });

// //SHOW ALL FREE DOUBLE ROOMS______________________________________________________________________________________
// app.get('/hotels/:location/:hotel/rooms/double/free', (req, res) => {
//     const location = req.params.location;
//     const hotel = req.params.hotel;
//     const filePath = `${location}/${hotel}.json`;

//     fs.readFile(filePath, 'utf8', (err, data) => {
//         if (err) {
//             res.status(500).send(`Error reading ${hotel}.json file`);
//             return;
//         }
//         let rooms = JSON.parse(data);
//         let freeRooms = Object.keys(rooms).filter(roomId =>  rooms[roomId].roomtype === "double" && rooms[roomId].status === "free");
//         res.send(freeRooms);
//     });
// });

// //SHOW ALL FREE SUITE ROOMS______________________________________________________________________________________
// app.get('/hotels/:location/:hotel/rooms/suite/free', (req, res) => {
//     const location = req.params.location;
//     const hotel = req.params.hotel;
//     const filePath = `${location}/${hotel}.json`;

//     fs.readFile(filePath, 'utf8', (err, data) => {
//         if (err) {
//             res.status(500).send(`Error reading ${hotel}.json file`);
//             return;
//         }
//         let rooms = JSON.parse(data);
//         let freeRooms = Object.keys(rooms).filter(roomId =>  rooms[roomId].roomtype === "suite" && rooms[roomId].status === "free");
//         res.send(freeRooms);
//     });
// });

// app.get('/hotels/berlin/rooms', (req, res) => {
// 	res.send(Object.keys(rooms));
// });

//SELF--------------------------------------------------------------------------------------
app.get('/hotels/berlin/rooms/free', (req, res) => {
	let freeRooms = Object.keys(rooms).filter(roomId => rooms[roomId].status === "free");
	res.send(freeRooms);
});

app.get('/hotels/berlin/rooms/free/single', (req, res) => {
	let freeRooms = Object.keys(rooms).filter(roomId => rooms[roomId].roomtype === "single" && rooms[roomId].status === "free");
	res.send(freeRooms);
});

app.get('/hotels/berlin/rooms/free/double', (req, res) => {
	let freeRooms = Object.keys(rooms).filter(roomId => rooms[roomId].roomtype === "double" && rooms[roomId].status === "free");
	res.send(freeRooms);
});

app.get('/hotels/berlin/rooms/free/suite', (req, res) => {
	let freeRooms = Object.keys(rooms).filter(roomId => rooms[roomId].roomtype === "suite" && rooms[roomId].status === "free");
	res.send(freeRooms);
});
//SELF--------------------------------------------------------------------------------------

app.get('/hotels/berlin/rooms/:roomid', (req, res) => {
	res.send(rooms[req.params.roomid]);
});

app.put('/hotels/berlin/rooms/:roomid', (req, res) => {
	let change = req.body;
	if (change.status === "free") {
		rooms[req.params.roomid].guest = "none";
		rooms[req.params.roomid].status = "free";
	}
	else if (change.status === "occupied" && change.guest != undefined) {
		rooms[req.params.roomid].guest = change.guest;
		rooms[req.params.roomid].status = "occupied";
	}
	else {
		res.sendStatus(400);
		return;
	}
	res.sendStatus(200);
});

//GET_SHOW All the occupied rooms by the user===========================
app.get('/hotels/:location/:hotel/rooms/occupied/plus', (req, res) => {
    const location = req.params.location;
    const hotel = req.params.hotel;
    const filePath = `${location}/${hotel}.json`;
    let queryName = req.query.name; 

    queryName = queryName.replace(/_/g, ' ');


    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send(`Error reading ${hotel}.json file`); 
            return;
        }

        let rooms = JSON.parse(data);
        
        let occupiedRooms = Object.keys(rooms).filter(roomId => {
            return rooms[roomId].status === "occupied" &&
                   rooms[roomId].guest === queryName; 
        });
        res.send(occupiedRooms);
    });
});

// //PUT_CustomerDetails=====================================================================
// app.put('/hotels/customer', (req, res) => {

//     const filePath = `customer/customerDetails.json`;

//     fs.readFile(filePath, 'utf8', (err, data) => {
//         if (err) {
//             res.status(500).send(`Error reading the file customerDetails.json`);
//             return;
//         }
        
//         let customers = JSON.parse(data);
//         let change = req.body;

//         customers.forEach(customer => {
//             if (customers[customer]) {
//                 if (change.status === "free") {
//                     rooms[roomid].guest = "none";
//                     rooms[roomid].status = "free";
//                     rooms[roomid].checkOut = "2024-03-19";
//                 } else if (change.status === "occupied" && change.guest !== undefined) {
//                     rooms[roomid].guest = change.guest;
//                     rooms[roomid].status = "occupied";
//                     rooms[roomid].checkOut = change.checkOut;
//                 } else {
//                     res.status(400).send(`Invalid status or missing guest information for room ${roomid}`);
//                     return;
//                 }
//             } else {
//                 res.status(404).send(`Room ID ${roomid} not found`);
//                 return;
//             }
//         });

//         fs.writeFile(filePath, JSON.stringify(rooms, null, 2), (err) => {
//             if (err) {
//                 res.status(500).send(`Error writing the file ${hotel}.json`);
//                 return;
//             }
//             res.sendStatus(200);
//         });
//     });
// });
// //PUT_CustomerDetails=====================================================================

//GET_Dealing with the Cars: ============================================================================
app.get('/hotels/:location/:hotel/cars/options', (req, res) => {
    const location = req.params.location;
    const hotel = req.params.hotel;
    const filePath = `${location}/${hotel}.json`;

     
    

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send(`Error reading ${hotel}.json file`); 
            return;
        }

        let jsonParser = JSON.parse(data);



        // let carNames = Object.values(carOptions).map(option => option.carName);
        res.send(jsonParser.carOptions);

    
        
    });
});


//GET_Dealing with the TRAINS: ============================================================================
app.get('/hotels/:location/:hotel/train/options', (req, res) => {
    const location = req.params.location;
    const hotel = req.params.hotel;
    const filePath = `${location}/${hotel}.json`;

     
    

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send(`Error reading ${hotel}.json file`); 
            return;
        }

        let jsonParser = JSON.parse(data);

        res.send(jsonParser.trainTicket);

    });
});

//GET_Hotel Rooms Information: ============================================================================
app.get('/hotels/:location/:hotel/rooms/info/extra/plus', (req, res) => {
    const location = req.params.location;
    const hotel = req.params.hotel;
    const filePath = `${location}/${hotel}.json`;
    

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send(`Error reading ${hotel}.json file`); 
            return;
        }

        let jsonParser = JSON.parse(data);
        let roomPrices = jsonParser.roomDetails;

        res.send(roomPrices);
        
    });
});

//GET_Dealing with the Tours and Travels: ============================================================================
app.get('/hotels/:location/tour/travels/guides/options', (req, res) => {
    const location = req.params.location;
    const tour = req.params.tour;
    const filePath = `${location}/tours.json`;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send(`Error reading tours.json file`); 
            return;
        }

        let jsonParser = JSON.parse(data);

        res.send(jsonParser);

    });
});

//PUT_Generating Invoices in the JSON==============================================================================================\
app.put('/hotels/:location/:hotel/customers/alpha/beta/invoices', (req, res) => {
    const filePath = `invoices/invoices.json`; 
    let { name, location, hotel, hotelAddress, packChoice, guests, occupiedRoomList, noOfRooms, userDate, checkOut, nights, showClassChoice, showClassPrice, station, showCarChoice, showCarName, showCarPrice, funTypeChoice, company, companyAddress, companyPhone, funActivities, typeInstallmentOption, interest, monthlyInstallment, totalPrice, discountedPrice, addPrice, finalPrice, paymentOption } = req.body;

    

    // Function to generate invoice number
    function generateInvoiceNumber(name, location, hotel, existingInvoices) {
        let secondName = name.split(' ')[1] || '';

        if (secondName.length === 0) {
            secondName = 'YYY';
        } else if (secondName.length < 3) {
            while (secondName.length < 3) {
                secondName += 'Y';
            }
        }

        let zifferLocation = location.slice(0, 2).toUpperCase();
        let zifferHotel = hotel.slice(0, 2).toUpperCase();

        let ziffer = name[0].toUpperCase();
        let zifferSecondName = secondName.slice(0, 3).toUpperCase();

        let tempZiffer = ziffer + zifferSecondName;

        let baseInvoiceNumber = `${tempZiffer}-${zifferLocation}${zifferHotel}`;

        let highestNumber = 0;

        for (let key in existingInvoices) {
            if (key.startsWith(baseInvoiceNumber)) {
                let numPart = key.split('-')[2];
                let num = parseInt(numPart);
                if (!isNaN(num) && num > highestNumber) {
                    highestNumber = num;
                }
            }
        }

        return `${baseInvoiceNumber}-${('000' + (highestNumber + 1)).slice(-4)}`;
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            res.status(500).send(`Error reading invoices.json file`);
            return;
        }

        let invoices = {};
        if (data) {
            try {
                invoices = JSON.parse(data);
            } catch (e) {
                res.status(500).send('Error parsing JSON data from file');
                return;
            }
        }

        let invoiceNumber = generateInvoiceNumber(name, location, hotel, invoices);

        invoices[invoiceNumber] = {
            name,
            location,
            hotel,
            hotelAddress,
            packChoice,
            guests,
            occupiedRoomList,
            noOfRooms,
            userDate,
            checkOut,
            nights,
            showClassChoice,
            showClassPrice,
            station,
            showCarChoice,
            showCarName,
            showCarPrice,
            funTypeChoice,
            company,
            companyAddress,
            companyPhone,
            funActivities,
            typeInstallmentOption,
            interest,
            monthlyInstallment,
            totalPrice,
            discountedPrice,
            addPrice,
            finalPrice,
            paymentOption,
        };

        

        fs.writeFile(filePath, JSON.stringify(invoices, null, 2), (err) => {
            if (err) {
                res.status(500).send('Error writing to invoices.json file');
                return;
            }

            res.status(200).send({ invoiceNumber });
        });
    });
});

//=====================================================================================================================

//GET_Dealing with an HTML Page ============================================================================
app.get('/generate-invoice', (req, res) => {
    let { invoiceNumber, name, location, hotel, hotelAddress, packChoice, guests, occupiedRoomList, userDate, checkOut, nights, totalPrice, discountedPrice, showClassChoice, showClassPrice, station, showCarChoice, showCarPrice, showCarName, funTypeChoice, addPrice, funActivities, company, companyAddress, companyPhone, typeInstallmentOption, monthlyInstallment, interest, paymentOption, finalPrice } = req.query;

    //Date Calculation for invoice generation
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    let day = String(today.getDate()).padStart(2, '0');
    let formattedDate = `${year}-${month}-${day}`;

    //Variable Configurations for a much more formatted display

    //1 Name of the location, hotel and the optionChoice
    packChoice = packChoice.charAt(0).toUpperCase() + packChoice.slice(1);
    hotel = hotel.charAt(0).toUpperCase() + hotel.slice(1);
    location = location.charAt(0).toUpperCase() + location.slice(1);
    funTypeChoice = funTypeChoice.charAt(0).toUpperCase() + funTypeChoice.slice(1);
    paymentOption = paymentOption.charAt(0).toUpperCase() + paymentOption.slice(1);

    //2 Make the funActivities a bit more compact
    funActivities = funActivities.substring(13); // 13 is the length of "PRICE: €20-> "and so on

    //3 Make the typeInstallmentOption more presentable
    if (typeInstallmentOption === "months6") {
        typeInstallmentOption = "6 Months"; 
    } else if (typeInstallmentOption === "months3") {
        typeInstallmentOption = "3 Months";
    }

    
    
    

    const htmlContent = `
       <!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>Invoice for ${name}</title>
        <link rel="icon" href="workingfavicon.png" type="image/png">

		<style>
			.invoice-box {
				max-width: 800px;
				margin: auto;
				padding: 30px;
				border: 1px solid #eee;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
				font-size: 16px;
				line-height: 24px;
				font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
				color: #555;
			}

			.invoice-box table {
				width: 100%;
				line-height: inherit;
				text-align: left;
			}

			.invoice-box table td {
				padding: 5px;
				vertical-align: top;
			}

			.invoice-box table tr td:nth-child(2) {
				text-align: right;
			}

			.invoice-box table tr.top table td {
				padding-bottom: 20px;
			}

			.invoice-box table tr.top table td.title {
				font-size: 45px;
				line-height: 45px;
				color: #333;
			}

			.invoice-box table tr.information table td {
				padding-bottom: 40px;
			}

			.invoice-box table tr.heading td {
				background: #eee;
				border-bottom: 1px solid #ddd;
				font-weight: bold;
			}

			.invoice-box table tr.details td {
				padding-bottom: 20px;
			}

			.invoice-box table tr.item td {
				border-bottom: 1px solid #eee;
			}

			.invoice-box table tr.item.last td {
				border-bottom: none;
			}

			.invoice-box table tr.total td:nth-child(2) {
				border-top: 2px solid #eee;
				font-weight: bold;
			}

			@media only screen and (max-width: 600px) {
				.invoice-box table tr.top table td {
					width: 100%;
					display: block;
					text-align: center;
				}

				.invoice-box table tr.information table td {
					width: 100%;
					display: block;
					text-align: center;
				}
			}

			/** RTL **/
			.invoice-box.rtl {
				direction: rtl;
				font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
			}

			.invoice-box.rtl table {
				text-align: right;
			}

			.invoice-box.rtl table tr td:nth-child(2) {
				text-align: left;
			}
		</style>
	</head>

	<body>
		<div class="invoice-box">
			<table cellpadding="0" cellspacing="0">
				<tr class="top">
					<td colspan="2">
						<table>
							<tr>
								<td class="title">
									<img
										src="logo-banner.png"
										style="width: 100%; max-width: 300px"
									/>
								</td>

								<td>
									Invoice No.: ${invoiceNumber}<br />
									Created: ${formattedDate}<br />
									
								</td>
							</tr>
						</table>
					</td>
				</tr>

				<tr class="information">
					<td colspan="2">
						<table>
							<tr>
								<td>
									A.S.A.P. Reisebüro International<br />
                                    Geschäftsführer (Owner): Kai Jander<br />
									Magdeburgerstraße 50<br />
									Brandenburg an der Havel, BRB 14770
								</td>

								<td>
									<br />
								</td>
							</tr>
						</table>
					</td>
				</tr>

				

				<tr class="heading"><td>Hotel Booking (incl. 19% VAT)</td> <td></td></tr>
				<tr class="item"><td>Name</td>					<td>${name}</td></tr>
                <tr class="item"><td>Location of the hotel</td>					<td>${location}</td></tr>
                <tr class="item"><td>Hotel</td>					<td>${hotel}</td></tr>
                <tr class="item"><td>Address of the hotel</td>					<td>${hotelAddress}</td></tr>
				<tr class="item"><td>Package Selected</td>		<td>${packChoice}</td></tr>
				<tr class="item"><td>Number of Guests</td>		<td>${guests}</td></tr>
				<tr class="item"><td>Rooms booked</td>			<td>${occupiedRoomList}</td></tr>
				<tr class="item"><td>Check-in Date</td>			<td>${userDate}</td></tr>
				<tr class="item"><td>Check-out date</td>		<td>${checkOut}</td></tr>
				<tr class="item"><td>Number of days</td>		<td>${nights}</td></tr>
				

				<tr class="heading"><td>Train Booking Details (incl. 7% VAT)</td> <td></td></tr>
				<tr class="item"><td>Type of train ticket</td>	<td>${showClassChoice}</td></tr>
                <tr class="item"><td>Cost of the train ticket (per guest)</td>	<td>€${showClassPrice}</td></tr>
                <tr class="item"><td>Nearest Station to the hotel</td>	<td>${station}</td></tr>

				<tr class="heading"><td>Rental Car Details (incl. 7% VAT)</td> <td></td></tr>
				<tr class="item"><td>Type of rental car</td>	<td>${showCarChoice}</td></tr>
                <tr class="item"><td>Rental Car Options</td>	<td>${showCarName}</td></tr>
                <tr class="item"><td>Price of the rental Car (per day)</td>	<td>€${showCarPrice}</td></tr>
                

                <tr class="heading"><td>Additional Fun Activities (Additional Prices; incl. 7% VAT)</td> <td></td></tr>
				<tr class="item"><td>Package Selected</td>	<td>${funTypeChoice}</td></tr>
                <tr class="item"><td>Provided by</td>	<td>${company}</td></tr>
                <tr class="item"><td>Provider's Address</td>	<td>${companyAddress}</td></tr>
                <tr class="item"><td>Provider's Contact</td>	<td>${companyPhone}</td></tr>
                <tr class="item"><td>Activities Included</td>	<td>${funActivities}</td></tr>
                

                <tr class="heading"><td>Monthly Installment Options</td> <td></td></tr>
				<tr class="item"><td>Monthly Installment Duration</td>	<td>${typeInstallmentOption}</td></tr>
                <tr class="item"><td>Interest Rate</td>	<td>${interest}</td></tr>
                <tr class="item"><td>Monthly Installment</td>	<td>€${monthlyInstallment}</td></tr>

                <tr class="heading"><td>Payment Checkout Details</td> <td></td></tr>
                <tr class="item"><td>Total Price(without discount)</td>		<td>€${totalPrice}</td></tr>
                <tr class="item"><td>Discounted Price (including train ticket and rental car price; see above) </td>		<td>€${discountedPrice}</td></tr>
                <tr class="item"><td>Additional Prices</td>	<td>€${addPrice}</td></tr>
				<tr class="item"><td>Mode of Payment</td>	<td>${paymentOption}</td></tr>
				
				


				<tr class="total">
					<td>Final Price (Discounted Price + Additional Prices due to Activities)</td>

					<td>€${finalPrice}</td>
				</tr>
			</table>
		</div>
	</body>
</html>
    `;

    const fileName = `invoice_${invoiceNumber}.html`;
    const filePath = `invoices/${fileName}`;

    // Write the HTML content to a file
    fs.writeFile(filePath, htmlContent, (err) => {
        if (err) {
            return res.status(500).send('Error generating invoice');
        }
        // Respond with the URL of the generated HTML file
        const fileUrl = `http://${ipman}:${port}/invoices/${fileName}`;
        res.send({ url: fileUrl });
    });
});










//DO NOT TOUCH=============================================================

//SERVER_SETUP=============================================================
let server = app.listen(port, function () {
	let host = server.address().address;
	let port = server.address().port;
	console.log("Webserver running at http://%s:%s", host, port);
});