class Car {
    constructor(data) {
        Object.keys(data).forEach(key => {
            this[key] = data[key];
        });
    }
}

class Rental {
    constructor(data) {
        this.options = {};
        Object.keys(data).forEach(key => {
            if(key == 'deductible_reduction') {
                this.options.deductible_reduction = data[key];
            } else {
                this[key] = data[key];
            }
        });
    }

    setPrice(pricePerDay, pricePerKm) {
        try {
            if(this.start_date && this.end_date && this.distance) {
                let daysOfRental = Math.ceil((this.getFormattedDate(this.end_date) - this.getFormattedDate(this.start_date)) / 86400) + 1;
                this.price = this.getTimePrice(daysOfRental, pricePerDay) + (this.distance * Number(pricePerKm));
                this.commission = this.getCommission(this.price, daysOfRental);
                if(this.options.deductible_reduction) {
                    this.options.deductible_reduction = daysOfRental * 4 * 100;
                } else {
                    this.options.deductible_reduction = 0;
                }
                this.billing = this.getBilling();
            } else {
                throw new Error('Please let us inform about your rental dates and your trip\'s distance');
            }
        } catch (e) {
            console.log(e);
        }
    }

    getTimePrice(days, pricePerDay) {
        try {
            var timePrice = 0;
            for(let i = 1; i <= days; i++) {
                if(i <= 1) {
                    timePrice += pricePerDay;
                } else if(i > 1 && i < 5) {
                    timePrice += pricePerDay - pricePerDay * 0.1;
                } else if(i >= 5 && i < 11) {
                    timePrice += pricePerDay - pricePerDay * 0.3;
                } else if(i >= 11) {
                    timePrice += pricePerDay - pricePerDay * 0.5;
                }
            }
            return timePrice;
        } catch (e) {
            console.log(e);
        }

    }

    getCommission(rentalPrice, days) {
        try {
            var commission = {};
            var commissionAmount = rentalPrice * 0.3;
            commission.insurance_fee = commissionAmount / 2;
            commission.assistance_fee = days * 100;
            commission.drivy_fee = commissionAmount - commission.insurance_fee - commission.assistance_fee;
            return commission;
        } catch (e) {
            console.log(e)
        }
    }

    getBilling() {
        try {
            let billing = [];
            let driver = new Billing('driver', 'debit', (this.price + this.options.deductible_reduction));
            billing.push(driver);
            let commission = this.commission.insurance_fee + this.commission.assistance_fee + this.commission.drivy_fee;
            let owner = new Billing('owner', 'credit', (this.price - commission));
            billing.push(owner);
            let insurance = new Billing('insurance', 'credit', this.commission.insurance_fee);
            billing.push(insurance);
            let assistance = new Billing('insurance', 'credit', this.commission.assistance_fee);
            billing.push(assistance);
            let drivy = new Billing('drivy', 'credit', this.commission.drivy_fee + this.options.deductible_reduction);
            billing.push(drivy);
            return billing;
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

class Billing {
    constructor(name, action, amount) {
        this.who = name;
        this.type = action;
        this.amount = amount;
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
                newOutput.rentals.push({id: newRental.id, actions: newRental.billing});
            }
        }
    });
    return newOutput;
};

exports.getRentalsList = getRentalsList;
