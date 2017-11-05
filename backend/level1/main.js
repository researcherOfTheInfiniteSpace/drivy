class Car {
    constructor(data) {
        Object.keys(data).forEach(key => {
            this[key] = data[key];
        });
    }
}

class Rental {
    constructor(data) {
        Object.keys(data).forEach(key => {
            this[key] = data[key];
        });
    }

    setPrice(pricePerDay, pricePerKm) {
        try {
            if(this.start_date && this.end_date && this.distance) {
                let daysOfRental = Math.ceil((this.getFormattedDate(this.end_date) - this.getFormattedDate(this.start_date)) / 86400) + 1;
                this.price = (daysOfRental * Number(pricePerDay)) + (this.distance * Number(pricePerKm));
            } else {
                throw new Error('Please let us inform about your rental dates and your trip\'s distance');
            }
        } catch (e) {
            console.log(e);
        }
    }

    getFormattedDate(date) {
        try {
            if(date && typeof date == 'string') {
                let splitDate = date.split("-");
                let formattedDate =  new Date(Number(splitDate[0] - 1), Number(splitDate[1]) - 1, Number(splitDate[2]) + 1);
                return Date.parse(formattedDate)/1000;
            } else {
                throw new Error('Please give a date with a proper format')
            }
        } catch (e) {
            console.log(e);
        }
    }
}

var getRentalsList = function() {
    let data = require('./data.json');
    let newOutput = {
        rentals: []
    };
    Object.keys(data).forEach(key => {
        if(key == "rentals") {
            for(prop in data[key]) {
                var newRental = new Rental(data[key][prop]);
                for(car in data["cars"]) {
                    if(data["cars"][car].id == newRental.car_id) {
                        var newCar = new Car(data["cars"][car]);
                    }
                }
                newRental.setPrice(newCar.price_per_day, newCar.price_per_km);
                newOutput.rentals.push({id: newRental.id, price: newRental.price})
            }
        }
    });
    return newOutput;
};

exports.getRentalsList = getRentalsList;
