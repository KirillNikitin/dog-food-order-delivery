import React, { Component } from 'react';
import Select from 'react-select';
import { MdDone } from 'react-icons/md';
import './App.scss';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			order : {
				customerName: '',
				customerSurname: '',
				customerEmail: '',
				customerPhonenumber: '',
				dogsBreed: '',
				dogsGender: '',
				dogsWeight: '',
				dogsName: '',
				frequency: '',
				customerIsRecipient: true,
				recipientName: '',
				recipientSurname: '',
				recipientPhonenumber: '',
				street: '',
				postcode: '',
				city: '',
				country: ''
			},			
			errors: {

			},
			cardNumberInputFlag: false,
			cardNumber: '',
			cardNumberIsValid: false,
			inputValueSpaced: '',
			paymentSystem: '',
			month: '',
			year: '',
			cardHolderName: '',
			cvvInputFlag: false,
			cvv: '',
			cardSaved: false,
			progress: 0
		}
		
		//bindings:
		this.handleAdd = this.handleAdd.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleFrequency = this.handleFrequency.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.recipientToggle = this.recipientToggle.bind(this);
		this.cardNumberValidate = this.cardNumberValidate.bind(this);
		this.cvvValidate = this.cvvValidate.bind(this);
		this.divideByFour = this.divideByFour.bind(this);
		this.handleCardHolder = this.handleCardHolder.bind(this);
		this.saveCardToggle = this.saveCardToggle.bind(this);
		this.progressBar = this.progressBar.bind(this);
	}
	
	
	//methods:
	handleAdd(e) {
		const value = e.target.value;;
		const {order} = {...this.state}
		const currentOrder = order;
		currentOrder[e.target.name] = value
		this.setState({
			order: currentOrder 
		});
		this.progressBar(this.state.order);
	}
	handleChange(e) {
		const label = e.label;
		if(e.name === 'month' || e.name === 'year') {
			this.setState({
				[e.name]: label 
			});
		} else {
			const {order} = {...this.state}
			const currentOrder = order;
			currentOrder[e.name] = label
			this.setState({
				order: currentOrder 
			});
		}
		this.progressBar(this.state.order);
	}
	handleFrequency(e) {
		const {order} = {...this.state}
		const currentOrder = order;
		currentOrder['frequency'] = e.currentTarget.value;
		this.setState({
			order: currentOrder
		});
		this.progressBar(this.state.order);
	}
	recipientToggle() {
		const {order} = {...this.state}
		const currentOrder = order;
		currentOrder['customerIsRecipient'] = !this.state.order.customerIsRecipient;
		this.setState({order: currentOrder});
		this.progressBar(this.state.order);
	}
	progressBar(obj){
		let total = 0;
		let count = 0;
		let flag = obj.customerIsRecipient;
		for(let [key, value] of Object.entries(obj)){
			if(flag && (key === 'recipientName' || key === 'recipientSurname' || key === 'recipientPhonenumber')) {
				total += 0;

				if(typeof obj[key] === 'string' && value.length !== 0 && key !== 'dogsName') {
					if((obj[key].length && obj['customerName'].length) || (obj[key].length && obj['customerSurname'].length) || (obj[key].length && obj['customerPhonenumber'].length)) {
						count += 0;
					} else {
						count += 1;	
					}								
				}
			} else {
				if(typeof obj[key] !== 'boolean' && key !== 'dogsName') {
					total += 1;
				}	
				if(typeof obj[key] === 'string' && value.length !== 0 && key !== 'dogsName') {
					count += 1;				
				}			
			}		
		}
		this.setState({progress: count*100/total})
	}
	handleSubmit(e) {
		e.preventDefault();
		let errors = {}
		for(let [key, value] of Object.entries(this.state.order)){
			if(!value.length) {
				errors[key] = true
			}
		}

		this.setState({errors: errors});
		console.log(this.state.errors);
	}
	divideByFour(str){
		let space = [];
		if(typeof str !== "string") str = str.toString();
		str = str.replace(/ /g,'');
		for(let i=0, len=str.length; i < len; i += 4) {
			space.push(str.substr(i, 4))
		}
		return space.join(' ')
	}
	cardNumberValidate(e) {
		const re = /^[0-9 \b]+$/;
		if((e.target.value === '' || re.test(e.target.value)) && e.target.value.length < 20) {
			console.log(parseInt(e.target.value))
			let inputValue = e.target.value.replace(/ /g,'');
			this.setState({
				cardNumberInputFlag: true, 
				cardNumber: inputValue,
				inputValueSpaced: this.divideByFour(e.target.value)
			});	
			
			console.log(this.state.inputValueSpaced);
			const americanExpressBeginning = /^(?:3[47].{0,16})$/;
			const americanExpress = /^(?:3[47][0-9]{13})$/;
			const visaBeginning = /^(?:4.{0,16})$/;
			const visa = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
			const masterCardBeginning = /^(?:5[1-5].{0,16})$/;
			const masterCard = /^(?:5[1-5][0-9]{14})$/;
			const dicsoverCardBeginning = /^(?:6(?:011|5[0-9][0-9]).{0,16})$/;
			const dicsoverCard = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
			const dinerClubBeginnig = /^(?:3(?:0[0-5]|[68]).{0,14})$/;
			const dinerClub = /^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$/;
			const JCBBeginning = /^(?:(?:2131|1800|35).{0,16})$/;
			const JCB = /^(?:(?:2131|1800|35\d{3})\d{11})$/;
			
			if(inputValue.match(americanExpressBeginning)) {
				console.log("This is a valid Amercican Express credit card number BEGINNING!");
				this.setState({paymentSystem: 'american-express'})
				if(inputValue.match(americanExpress)) {
					console.log("This is a valid Amercican Express credit card number!");
					this.setState({cardNumberIsValid: true});
				} else {
					this.setState({cardNumberIsValid: false});
				}
			} else if(inputValue.match(visaBeginning)) {	
				console.log("This is a valid Visa credit card number BEGINNING!");
				this.setState({paymentSystem: 'visa'})
				if(inputValue.match(visa)) {	
					console.log("This is a valid Visa credit card number!");
					this.setState({cardNumberIsValid: true});
				} else {
					this.setState({cardNumberIsValid: false});
				}
			} else if(inputValue.match(masterCardBeginning)) {	
				console.log("This is a valid Master Card start credit card number BEGINNING!");
				this.setState({paymentSystem: 'mastercard'})
				if(inputValue.match(masterCard)) {	
					this.setState({cardNumberIsValid: true});
					console.log("This is a valid Master Card credit card number!");
				} else {
					this.setState({cardNumberIsValid: false});
				}
				console.log("This is a valid Master Card start credit card number!");
			} else if(inputValue.match(dicsoverCardBeginning)) {	
				console.log("This is a valid Discover Card credit card number BEGINNING!");
				this.setState({paymentSystem: 'discover'})
				if(inputValue.match(dicsoverCard)) {	
					this.setState({cardNumberIsValid: true});
					console.log("This is a valid Discover Card credit card number!");
				} else {
					this.setState({cardNumberIsValid: false});
				}
			} else if(inputValue.match(dinerClubBeginnig)) {
				console.log("This is a valid Diner Club Card credit card number BEGINNING!");
				this.setState({paymentSystem: 'dinnerclub'})
				if(inputValue.match(dinerClub)) {
					this.setState({cardNumberIsValid: true});
					console.log("This is a valid Diner Club Card credit card number!");
				} else {
					this.setState({cardNumberIsValid: false});
				}
			} else if(inputValue.match(JCBBeginning)) {	
				console.log("This is a valid JCB Card credit card number BEGINNING!");
				this.setState({paymentSystem: 'JCB'})
				if(inputValue.match(JCB)) {	
					this.setState({cardNumberIsValid: true});
					console.log("This is a valid JCB Card credit card number!");
				} else {
					this.setState({cardNumberIsValid: false});
				}
			} else {
				this.setState({paymentSystem: ''})
				console.log("Not a valid credit card number!");
			}
		}
	}

	cvvValidate(e) {
		const re = /^[0-9\b]+$/;
		if(e.target.value !== '') {
			if (re.test(e.target.value) && e.target.value.length < 4) {
				
				if (e.target.value.length === 3) {
					this.setState({cvvInputFlag: true, cvv: parseInt(e.target.value)});
				} else {
					this.setState({cvvInputFlag: false, cvv: parseInt(e.target.value)});
				}				
			} 
		} else {
			this.setState({cvvInputFlag: false, cvv: ''});
		}	
	}

	handleCardHolder(e) {
		this.setState({cardHolderName: e.target.value});
	}
	saveCardToggle(e) {
		this.setState({cardSaved: !this.state.cardSaved});
	}
		
	//and method render:
	render() {
		const dogBreeds = [
			{ label: "Afador", value: 1, name: "dogsBreed" }, 
			{ label: "Affenhuahua", value: 2, name: "dogsBreed" }, 
			{ label: "Affenpinscher", value: 3, name: "dogsBreed" },
			{ label: "Afghan Hound", value: 4, name: "dogsBreed" },
			{ label: "Airedale Terrier", value: 5, name: "dogsBreed" },
			{ label: "Akbash", value: 6, name: "dogsBreed" },
			{ label: "Akita", value: 7, name: "dogsBreed" }
		]
		const dogGender = [
			{label: "Boy", value: 1, name: "dogsGender"},
			{label: "Girl", value: 2, name: "dogsGender"}
		]
		const frequencyOptions = [
			{frequency: "Every day", value: 1},
			{frequency: "Three times a week", value: 2},
			{frequency: "Twice a week", value: 3},
			{frequency: "Once a week", value: 4},
			{frequency: "Twice a month", value: 5},
			{frequency: "Once a month", value: 6}
		]
		const countries = [
			{label: "Argentina", value: "AR", name: "country"},
			{label: "Australia", value: "AU", name: "country" },
			{label: "Austria", value: "AT", name: "country" },
			{label: "Azerbaijan", value: "AZ", name: "country" },
			{label: "Bahamas", value: "BS", name: "country" },
			{label: "Belgium", value: "BE", name: "country" },
			{label: "Bermuda", value: "BM", name: "country" },
			{label: "Brazil", value: "BR", name: "country" },
			{label: "Canada", value: "CA", name: "country" },
			{label: "Chile", value: "CL", name: "country" },
			{label: "China", value: "CN", name: "country" },
			{label: "Colombia", value: "CO", name: "country" },
			{label: "Costa Rica", value: "CR", name: "country" },
			{label: "Croatia", value: "HR", name: "country" },
			{label: "Cyprus", value: "CY", name: "country" },
			{label: "Czech Republic", value: "CZ", name: "country" },
			{label: "Denmark", value: "DK", name: "country" },
			{label: "Dominican Republic", value: "DO", name: "country" },
			{label: "Ecuador", value: "EC", name: "country" },
			{label: "Egypt", value: "EG", name: "country" },
			{label: "Estonia", value: "EE", name: "country" },
			{label: "Finland", value: "FI", name: "country" },
			{label: "France", value: "FR", name: "country" },
			{label: "Germany", value: "DE", name: "country" },
			{label: "Greece", value: "GR", name: "country" },
			{label: "Honduras", value: "HN", name: "country" },
			{label: "Hungary", value: "HU", name: "country" },
			{label: "India", value: "IN", name: "country" },
			{label: "Indonesia", value: "ID", name: "country" },
			{label: "Iraq", value: "IQ", name: "country" },
			{label: "Ireland", value: "IE", name: "country" },
			{label: "Israel", value: "IL", name: "country" },
			{label: "Italy", value: "IT", name: "country" },
			{label: "Japan", value: "JP", name: "country" },
			{label: "Kazakhstan", value: "KZ", name: "country" },
			{label: "Latvia", value: "LV", name: "country" },
			{label: "Lithuania", value: "LT", name: "country" },
			{label: "Luxembourg", value: "LU", name: "country" },
			{label: "Malaysia", value: "MY", name: "country" },
			{label: "Mexico", value: "MX", name: "country" },
			{label: "Morocco", value: "MA", name: "country" },
			{label: "Nepal", value: "NP", name: "country" },
			{label: "Netherlands", value: "NL", name: "country" },
			{label: "New Zealand", value: "NZ", name: "country" },
			{label: "Norway", value: "NO", name: "country" },
			{label: "Pakistan", value: "PK", name: "country" },
			{label: "Peru", value: "PE", name: "country" },
			{label: "Philippines", value: "PH", name: "country" },
			{label: "Poland", value: "PL", name: "country" },
			{label: "Portugal", value: "PT", name: "country" },
			{label: "Romania", value: "RO", name: "country" },
			{label: "Russian Federation", value: "RU", name: "country" },
			{label: "Saudi Arabia", value: "SA", name: "country" },
			{label: "Singapore", value: "SG", name: "country" },
			{label: "Slovenia", value: "SI", name: "country" },
			{label: "South Africa", value: "ZA", name: "country" },
			{label: "Spain", value: "ES", name: "country" },
			{label: "Sweden", value: "SE", name: "country" },
			{label: "Switzerland", value: "CH", name: "country" },
			{label: "Taiwan", value: "TW", name: "country" },
			{label: "Thailand", value: "TH", name: "country" },
			{label: "Turkey", value: "TR", name: "country" },
			{label: "Ukraine", value: "UA", name: "country" },
			{label: "United Arab Emirates", value: "AE", name: "country" },
			{label: "United Kingdom", value: "UK", name: "country" },
			{label: "United States", value: "US", name: "country" }
		]
		const months = [
			{label: "01", value: 1, name: 'month'},
			{label: "02", value: 2, name: 'month'},
			{label: "03", value: 3, name: 'month'},
			{label: "04", value: 4, name: 'month'},
			{label: "05", value: 5, name: 'month'},
			{label: "06", value: 6, name: 'month'},
			{label: "07", value: 7, name: 'month'},
			{label: "08", value: 8, name: 'month'},
			{label: "09", value: 9, name: 'month'},
			{label: "10", value: 10, name: 'month'},
			{label: "11", value: 11, name: 'month'},
			{label: "12", value: 12, name: 'month'}
		]
		const years = [
			{label: "20", value: 1, name: 'year'},
			{label: "21", value: 2, name: 'year'},
			{label: "22", value: 3, name: 'year'},
			{label: "23", value: 4, name: 'year'},
			{label: "24", value: 5, name: 'year'},
			{label: "25", value: 6, name: 'year'},
			{label: "26", value: 7, name: 'year'}
		]
		let delieveryFrequencyOptions = frequencyOptions.map(function(res) {
			return (
				
				  <label className="radiobutton-container" key={res.value}>					
					<input type="radio" name="frequency" value={res.frequency} checked={res.frequency === this.state.order.frequency} onChange={this.handleFrequency} />
					{res.frequency}
					<span className="radiobutton-checkmark"></span>
				  </label>
				
			)
		}, this)
		let paymentSystem = this.state.paymentSystem;
		let classBoxCard = ["card"];
		if(this.state.cardNumber !== '' || this.state.cvv !== '' || this.state.month !== '' || this.state.year !== '' || this.state.cardHolderName !== '') {
			classBoxCard.push('on');
		}
		if(this.state.cardSaved) {
			classBoxCard.push('card-saved');
		}  
		let classBoxCardNumberValid = ["card-number-valid"];
		if(this.state.cardNumberIsValid) {
			classBoxCardNumberValid.push('active');
		}
		let progressBarStyle = {
			width: this.state.progress + '%'
		}
		
		return (
			
			<div className="form-container">
			  <form onSubmit={this.handleSubmit} autoComplete="off" className="submit-form">
				<section>
					<h4>Order information:</h4>
					<div>
					  <label>
						Your Name
						<input className="css-yk16xz-control" type="text" name="customerName" value={this.state.order.customerName} onChange={this.handleAdd} />
						<span className="error">{this.state.errors["customerName"] ? '*' : ''}</span>
					  </label>
					</div>  
					<div>
					  <label>
						Your Surname
						<input className="css-yk16xz-control" type="text" name="customerSurname" value={this.state.order.customerSurname} onChange={this.handleAdd} />
						<span className="error">{this.state.errors["customerSurname"] ? '*' : ''}</span>
					  </label>
					</div>
					<div>
					  <label>
						Your E-mail
						<input className="css-yk16xz-control" type="text" name="customerEmail" value={this.state.order.customerEmail} onChange={this.handleAdd} />
						<span className="error">{this.state.errors["customerEmail"] ? '*' : ''}</span>
					  </label>
					</div>
					<div>
					  <label>
						Your Phonenumber
						<input className="css-yk16xz-control" type="text" name="customerPhonenumber" value={this.state.order.customerPhonenumber} onChange={this.handleAdd} />
						<span className="error">{this.state.errors["customerPhonenumber"] ? '*' : ''}</span>
					  </label>
					</div>
					<div>
					  <label>
						Your Dog's breed 
						<Select options={ dogBreeds } onChange={this.handleChange}/>
						<span className="error">{this.state.errors["dogsBreed"] ? '*' : ''}</span>
					  </label>
					</div>
					<div>					
					  <label>
						Your Dog's weight (kilos)
						<input className="css-yk16xz-control" type="number" min="0" name="dogsWeight" value={this.state.order.dogsWeight} onChange={this.handleAdd} />
						<span className="error">{this.state.errors["dogsWeight"] ? '*' : ''}</span>
					  </label>
					</div>
					<div>
					  <label>
						Your Dog's gender
						<Select options={ dogGender } onChange={this.handleChange} />
						<span className="error">{this.state.errors["dogsGender"] ? '*' : ''}</span>
					  </label>
					</div>
					<div>
					  <label>
						Your Dog's name (optional)
						<input className="css-yk16xz-control" type="text" name="dogsName" value={this.state.order.dogsName} onChange={this.handleAdd} />
					  </label>
					</div>
					<div className="frequency-of-delivery">					
						<label>Frequency of delievery<span className="error">{this.state.errors["frequency"] ? '*' : ''}</span></label>
						{delieveryFrequencyOptions}
						
					</div>	
				</section>
				<section>
				<h4>Address:</h4>
					<div>
						<label>
							Recipient name:
							<input className="css-yk16xz-control" type="text" name="recipientName" disabled={this.state.order.customerIsRecipient} value={this.state.order.customerIsRecipient ? this.state.order.customerName : this.state.order.recipientName} onChange={this.handleAdd} />
							<span className="error">{this.state.errors["recipientName"] && !this.state.order.customerIsRecipient ? '*' : ''}</span>
						</label>
					</div>
					<div>
						<label>
							Recipient surname:
							<input className="css-yk16xz-control" type="text" name="recipientSurname" disabled={this.state.order.customerIsRecipient} value={this.state.order.customerIsRecipient ? this.state.order.customerSurname : this.state.order.recipientSurname} onChange={this.handleAdd} />
							<span className="error">{this.state.errors["recipientSurname"] && !this.state.order.customerIsRecipient ? '*' : ''}</span>
						</label>
					</div>
					<div>
						<label>
							Recipient phonenumber:
							<input className="css-yk16xz-control" type="text" name="recipientPhonenumber" disabled={this.state.order.customerIsRecipient} value={this.state.order.customerIsRecipient ? this.state.order.customerPhonenumber : this.state.order.recipientPhonenumber} onChange={this.handleAdd} />
							<span className="error">{this.state.errors["recipientPhonenumber"] && !this.state.order.customerIsRecipient ? '*' : ''}</span>
						</label>
					</div>
					<div>
						<label className="checkbox-container">
							Recipient is not me
							<input className="css-yk16xz-control" type="checkbox" name="customerIsNotRecipient" onChange={this.recipientToggle} />
							<span className="checkbox-checkmark"></span>
						</label>
					</div>
					<div>
						<label>
							Street:
							<input className="css-yk16xz-control" type="text" name="street" value={this.state.order.street} onChange={this.handleAdd} />
							<span className="error">{this.state.errors["street"] ? '*' : ''}</span>
						</label>
					</div>
					<div>
						<label>
							Postcode:
							<input className="css-yk16xz-control" type="text" name="postcode" value={this.state.order.postcode} onChange={this.handleAdd} />
							<span className="error">{this.state.errors["postcode"] ? '*' : ''}</span>
						</label>
					</div>		
					<div>
						<label>
							City:
							<input className="css-yk16xz-control" type="text" name="city" value={this.state.order.city} onChange={this.handleAdd} />
							<span className="error">{this.state.errors["city"] ? '*' : ''}</span>
						</label>
					</div>
					
					<div>
						<label>
							Country:
							<Select options = { countries } onChange={this.handleChange} />
							<span className="error">{this.state.errors["country"] ? '*' : ''}</span>
						</label>
					</div>						
				</section>
				<section>
					<h4>Payment:</h4>
					<div>
						<div className={classBoxCard.join(' ')}>
							<div className="card-chip">
								<div className="card-chip_lev1 part1">
									<div className="card-chip_lev2 part1">									
									</div>
									<div className="card-chip_lev2 part2">									
									</div>
									<div className="card-chip_lev2 part3">									
									</div>
								</div>
								<div className="card-chip_lev1 part2">
									<div className="card-chip_lev2 part4">									
									</div>
									<div className="card-chip_lev2 part5">									
									</div>
								</div>
							</div>
							<div className="card-payment-system">
								<div className={paymentSystem}></div>
							</div>
							<div className="card-number">
								<div className="card-text">{this.state.cardNumberInputFlag && !isNaN(this.state.cardNumber) ? this.state.inputValueSpaced : ''}</div>
								<input type="text" onChange={this.cardNumberValidate} value={this.state.cardNumberInputFlag && !isNaN(this.state.cardNumber) ? this.state.inputValueSpaced : ''} placeholder="0000 0000 0000 0000" /><span className={classBoxCardNumberValid.join(' ')}><MdDone /></span>
							</div>
							<div className="card-valid">
								<div className="card-valid-month">
									<Select options={ months } onChange={this.handleChange}/>
								</div>
								<div className="card-valid-divider">
									/
								</div>
								<div className="card-valid-year">
									<Select options={ years } onChange={this.handleChange}/>
								</div>	
								<div className="card-text">
									<div>{this.state.month !== '' ? this.state.month : ''}</div>
									<div className="card-text-devider">/</div>
									<div>{this.state.year !== '' ? this.state.year : ''}</div></div>
							</div>
							<div className="card-cardholder">
								<div className="card-text">{this.state.cardHolderName.toUpperCase()}</div>
								<input type="text" onChange={this.handleCardHolder} value={this.state.cardHolderName ? this.state.cardHolderName.toUpperCase() : ''}/>
							</div>
							<div className="card-cvv">
								<span>cvv</span>
								<div className="card-text">***</div>
								<input type="text" onChange={this.cvvValidate} value={this.state.cvv !== '' && !isNaN(this.state.cvv) ? this.state.cvv : ''}/>
							</div>
						</div>
						<div>
							<label className="checkbox-container">
								Save this card
								<input type="checkbox" disabled={!(this.state.cardNumberIsValid && this.state.cvvInputFlag && this.state.month !== '' && this.state.year !== '')} name="saveCard" onChange={this.saveCardToggle} />
								<span className="checkbox-checkmark"></span>
							</label>
						</div>
					</div>
				</section>
				  
				  <button type="submit" className="signup-button" value="Sign Up" > Sign Up </button>
			  </form>
			  <div className="progress-bar" style={progressBarStyle}></div>
			</div>
		);
	}
}

export default App;
