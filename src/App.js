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
				emailIsValid: false,
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
		this.emailValidate = this.emailValidate.bind(this);
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
	emailValidate(e) {
		const  re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		const {order} = {...this.state}
		const currentOrder = order;
		if(e.target.value !== '') {
			if (re.test(String(e.target.value).toLowerCase())) {
				currentOrder['emailIsValid'] = true;	
			} else {
				currentOrder['emailIsValid'] = false;	
			}			
		} else {
			currentOrder['emailIsValid'] = false;
		}	
		currentOrder['customerEmail'] = e.target.value;
		this.setState({
			order: currentOrder 
		});
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
		let errors = {}, count = 0;
		for(let [key, value] of Object.entries(this.state.order)){
			if(!value.length && typeof this.state.order[key] === 'string' && key !== 'dogsName') {
				if(this.state.order.customerIsRecipient) {
					if(key === 'recipientName' || key === 'recipientSurname' || key === 'recipientPhonenumber') {
						count += 0; 
						errors[key] = false; 
					} else {
						count += 1;
						errors[key] = true;
					}
				} else {
					count += 1;
					errors[key] = true;
				}			
			} else if(value.length && key === 'customerEmail') {
				if(this.state.order.emailIsValid) {
					count += 0;
					errors[key] = false;
				} else {
					count += 1;
					errors[key] = true;
				}				
			}
		}
		if(!count) {
			(this.state.cardNumberIsValid && this.state.cvvInputFlag && this.state.month !== '' && this.state.year !== '') 
				? alert('data is ready to be sent to the server side')
				: alert('Did not you forget about the bankcard?')
		}
		this.setState({errors: errors});
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
			let inputValue = e.target.value.replace(/ /g,'');
			this.setState({
				cardNumberInputFlag: true, 
				cardNumber: inputValue,
				inputValueSpaced: this.divideByFour(e.target.value)
			});	
			
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
				this.setState({paymentSystem: 'american-express'})
				if(inputValue.match(americanExpress)) {
					this.setState({cardNumberIsValid: true});
				} else {
					this.setState({cardNumberIsValid: false});
				}
			} else if(inputValue.match(visaBeginning)) {	
				this.setState({paymentSystem: 'visa'})
				if(inputValue.match(visa)) {	
					this.setState({cardNumberIsValid: true});
				} else {
					this.setState({cardNumberIsValid: false});
				}
			} else if(inputValue.match(masterCardBeginning)) {	
				this.setState({paymentSystem: 'mastercard'})
				if(inputValue.match(masterCard)) {	
					this.setState({cardNumberIsValid: true});
				} else {
					this.setState({cardNumberIsValid: false});
				}
			} else if(inputValue.match(dicsoverCardBeginning)) {	
				this.setState({paymentSystem: 'discover'})
				if(inputValue.match(dicsoverCard)) {	
					this.setState({cardNumberIsValid: true});
				} else {
					this.setState({cardNumberIsValid: false});
				}
			} else if(inputValue.match(dinerClubBeginnig)) {
				this.setState({paymentSystem: 'dinnerclub'})
				if(inputValue.match(dinerClub)) {
					this.setState({cardNumberIsValid: true});
				} else {
					this.setState({cardNumberIsValid: false});
				}
			} else if(inputValue.match(JCBBeginning)) {	
				this.setState({paymentSystem: 'JCB'})
				if(inputValue.match(JCB)) {	
					this.setState({cardNumberIsValid: true});
				} else {
					this.setState({cardNumberIsValid: false});
				}
			} else {
				this.setState({paymentSystem: ''})
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
			{ label: "Akita", value: 7, name: "dogsBreed" },
			{ label: "Akita Shepherd", value: 8, name: "dogsBreed" },
			{ label: "Alaskan Klee Kai", value: 9, name: "dogsBreed" },
			{ label: "Alaskan Malamute", value: 10, name: "dogsBreed" },
			{ label: "American Bulldog", value: 11, name: "dogsBreed" },
			{ label: "American English Coonhound", value: 12, name: "dogsBreed" },
			{ label: "American Eskimo Dog", value: 13, name: "dogsBreed" },
			{ label: "American Foxhound", value: 14, name: "dogsBreed" },
			{ label: "American Leopard Hound", value: 15, name: "dogsBreed" },
			{ label: "American Pit Bull Terrier", value: 16, name: "dogsBreed" },
			{ label: "American Pugabull", value: 17, name: "dogsBreed" },
			{ label: "American Staffordshire Terrier", value: 18, name: "dogsBreed" },
			{ label: "American Water Spaniel", value: 19, name: "dogsBreed" },
			{ label: "Anatolian Shepherd Dog", value: 20, name: "dogsBreed" },
			{ label: "Appenzeller Sennenhunde", value: 21, name: "dogsBreed" },
			{ label: "Auggie", value: 22, name: "dogsBreed" },
			{ label: "Aussiedoodle", value: 23, name: "dogsBreed" },
			{ label: "Aussiepom", value: 24, name: "dogsBreed" },
			{ label: "Australian Cattle Dog", value: 25, name: "dogsBreed" },
			{ label: "Australian Kelpie", value: 26, name: "dogsBreed" },
			{ label: "Australian Retriever", value: 27, name: "dogsBreed" },
			{ label: "Australian Shepherd", value: 28, name: "dogsBreed" },
			{ label: "Australian Shepherd Husky", value: 29, name: "dogsBreed" },
			{ label: "Australian Shepherd Lab Mix", value: 30, name: "dogsBreed" },
			{ label: "Australian Shepherd Pit Bull Mix", value: 31, name: "dogsBreed" },
			{ label: "Australian Terrier", value: 32, name: "dogsBreed" },
			{ label: "Azawakh", value: 33, name: "dogsBreed" },
			{ label: "Barbet", value: 34, name: "dogsBreed" },
			{ label: "Basenji", value: 35, name: "dogsBreed" },
			{ label: "Bassador", value: 36, name: "dogsBreed" },
			{ label: "Basset Fauve de Bretagne", value: 37, name: "dogsBreed" },
			{ label: "Basset Hound", value: 38, name: "dogsBreed" },
			{ label: "Basset Retriever", value: 39, name: "dogsBreed" },
			{ label: "Bavarian Mountain Scent Hound", value: 40, name: "dogsBreed" },
			{ label: "Beabull", value: 41, name: "dogsBreed" },
			{ label: "Beagle", value: 42, name: "dogsBreed" },
			{ label: "Beaglier", value: 43, name: "dogsBreed" },
			{ label: "Bearded Collie", value: 44, name: "dogsBreed" },
			{ label: "Bedlington Terrier", value: 45, name: "dogsBreed" },
			{ label: "Belgian Malinois", value: 46, name: "dogsBreed" },
			{ label: "Belgian Sheepdog", value: 47, name: "dogsBreed" },
			{ label: "Belgian Tervuren", value: 48, name: "dogsBreed" },
			{ label: "Berger Picard", value: 49, name: "dogsBreed" },
			{ label: "Bernedoodle", value: 50, name: "dogsBreed" },
			{ label: "Bernese Mountain Dog", value: 51, name: "dogsBreed" },
			{ label: "Bichon Frise", value: 52, name: "dogsBreed" },
			{ label: "Biewer Terrier", value: 53, name: "dogsBreed" },
			{ label: "Black and Tan Coonhound", value: 54, name: "dogsBreed" },
			{ label: "Black Mouth Cur", value: 55, name: "dogsBreed" },
			{ label: "Black Russian Terrier", value: 56, name: "dogsBreed" },
			{ label: "Bloodhound", value: 57, name: "dogsBreed" },
			{ label: "Blue Lacy", value: 58, name: "dogsBreed" },
			{ label: "Bluetick Coonhound", value: 59, name: "dogsBreed" },
			{ label: "Bocker", value: 60, name: "dogsBreed" },
			{ label: "Boerboel", value: 61, name: "dogsBreed" },
			{ label: "Boglen Terrier", value: 62, name: "dogsBreed" },
			{ label: "Bolognese", value: 63, name: "dogsBreed" },
			{ label: "Borador", value: 64, name: "dogsBreed" },
			{ label: "Border Collie", value: 65, name: "dogsBreed" },
			{ label: "Border Sheepdog", value: 66, name: "dogsBreed" },
			{ label: "Border Terrier", value: 67, name: "dogsBreed" },
			{ label: "Bordoodle", value: 68, name: "dogsBreed" },
			{ label: "Borzoi", value: 69, name: "dogsBreed" },
			{ label: "BoShih", value: 70, name: "dogsBreed" },
			{ label: "Bossie", value: 71, name: "dogsBreed" },
			{ label: "Boston Boxer", value: 72, name: "dogsBreed" },
			{ label: "Boston Terrier", value: 73, name: "dogsBreed" },
			{ label: "Bouvier des Flandres", value: 74, name: "dogsBreed" },
			{ label: "Boxador", value: 75, name: "dogsBreed" },
			{ label: "Boxer", value: 76, name: "dogsBreed" },
			{ label: "Boxerdoodle", value: 77, name: "dogsBreed" },
			{ label: "Boxmatian", value: 78, name: "dogsBreed" },
			{ label: "Boxweiler", value: 79, name: "dogsBreed" },
			{ label: "Boykin Spaniel", value: 80, name: "dogsBreed" },
			{ label: "Bracco Italiano", value: 81, name: "dogsBreed" },
			{ label: "Braque du Bourbonnais", value: 82, name: "dogsBreed" },
			{ label: "Briard", value: 83, name: "dogsBreed" },
			{ label: "Brittany", value: 84, name: "dogsBreed" },
			{ label: "Broholmer", value: 85, name: "dogsBreed" },
			{ label: "Brussels Griffon", value: 86, name: "dogsBreed" },
			{ label: "Bugg", value: 87, name: "dogsBreed" },
			{ label: "Bull-Pei", value: 88, name: "dogsBreed" },
			{ label: "Bull Terrier", value: 89, name: "dogsBreed" },
			{ label: "Bullador", value: 90, name: "dogsBreed" },
			{ label: "Bullboxer Pit", value: 91, name: "dogsBreed" },
			{ label: "Bulldog", value: 92, name: "dogsBreed" },
			{ label: "Bullmastiff", value: 93, name: "dogsBreed" },
			{ label: "Bullmatian", value: 94, name: "dogsBreed" },
			{ label: "Cairn Terrier", value: 95, name: "dogsBreed" },
			{ label: "Canaan Dog", value: 96, name: "dogsBreed" },
			{ label: "Cane Corso", value: 97, name: "dogsBreed" },
			{ label: "Cardigan Welsh Corgi", value: 98, name: "dogsBreed" },
			{ label: "Catahoula Bulldog", value: 99, name: "dogsBreed" },
			{ label: "Catahoula Leopard Dog", value: 100, name: "dogsBreed" },
			{ label: "Caucasian Shepherd Dog", value: 101, name: "dogsBreed" },
			{ label: "Cav-a-Jack", value: 102, name: "dogsBreed" },
			{ label: "Cavachon", value: 103, name: "dogsBreed" },
			{ label: "Cavador", value: 104, name: "dogsBreed" },
			{ label: "Cavalier King Charles Spaniel", value: 105, name: "dogsBreed" },
			{ label: "Cavapoo", value: 106, name: "dogsBreed" },
			{ label: "Cesky Terrier", value: 107, name: "dogsBreed" },
			{ label: "Chabrador", value: 108, name: "dogsBreed" },
			{ label: "Cheagle", value: 109, name: "dogsBreed" },
			{ label: "Chesapeake Bay Retriever", value: 110, name: "dogsBreed" },
			{ label: "Chi Chi", value: 111, name: "dogsBreed" },
			{ label: "Chi-Poo", value: 112, name: "dogsBreed" },
			{ label: "Chigi", value: 113, name: "dogsBreed" },
			{ label: "Chihuahua", value: 114, name: "dogsBreed" },
			{ label: "Chilier", value: 115, name: "dogsBreed" },
			{ label: "Chinese Crested", value: 116, name: "dogsBreed" },
			{ label: "Chinese Shar-Pei", value: 117, name: "dogsBreed" },
			{ label: "Chinook", value: 118, name: "dogsBreed" },
			{ label: "Chion", value: 119, name: "dogsBreed" },
			{ label: "Chipin", value: 120, name: "dogsBreed" },
			{ label: "Chiweenie", value: 121, name: "dogsBreed" },
			{ label: "Chorkie", value: 122, name: "dogsBreed" },
			{ label: "Chow Chow", value: 123, name: "dogsBreed" },
			{ label: "Chow Shepherd", value: 124, name: "dogsBreed" },
			{ label: "Chug", value: 125, name: "dogsBreed" },
			{ label: "Chusky", value: 126, name: "dogsBreed" },
			{ label: "Cirneco dell’Etna", value: 127, name: "dogsBreed" },
			{ label: "Clumber Spaniel", value: 128, name: "dogsBreed" },
			{ label: "Cockalier", value: 129, name: "dogsBreed" },
			{ label: "Cockapoo", value: 130, name: "dogsBreed" },
			{ label: "Cocker Spaniel", value: 131, name: "dogsBreed" },
			{ label: "Collie", value: 132, name: "dogsBreed" },
			{ label: "Corgi Inu", value: 133, name: "dogsBreed" },
			{ label: "Corgidor", value: 134, name: "dogsBreed" },
			{ label: "Corman Shepherd", value: 135, name: "dogsBreed" },
			{ label: "Coton de Tulear", value: 136, name: "dogsBreed" },
			{ label: "Curly-Coated Retriever", value: 137, name: "dogsBreed" },
			{ label: "Dachsador", value: 138, name: "dogsBreed" },
			{ label: "Dachshund", value: 139, name: "dogsBreed" },
			{ label: "Dalmatian", value: 140, name: "dogsBreed" },
			{ label: "Dandie Dinmont Terrier", value: 141, name: "dogsBreed" },
			{ label: "Daniff", value: 142, name: "dogsBreed" },
			{ label: "Deutscher Wachtelhund", value: 143, name: "dogsBreed" },
			{ label: "Doberdor", value: 144, name: "dogsBreed" },
			{ label: "Doberman Pinscher", value: 145, name: "dogsBreed" },
			{ label: "Docker", value: 146, name: "dogsBreed" },
			{ label: "Dogo Argentino", value: 147, name: "dogsBreed" },
			{ label: "Dogue de Bordeaux", value: 148, name: "dogsBreed" },
			{ label: "Dorgi", value: 149, name: "dogsBreed" },
			{ label: "Dorkie", value: 150, name: "dogsBreed" },
			{ label: "Doxiepoo", value: 151, name: "dogsBreed" },
			{ label: "Doxle", value: 152, name: "dogsBreed" },
			{ label: "Drentsche Patrijshond", value: 153, name: "dogsBreed" },
			{ label: "Drever", value: 154, name: "dogsBreed" },
			{ label: "Dutch Shepherd", value: 155, name: "dogsBreed" },
			{ label: "English Cocker Spaniel", value: 156, name: "dogsBreed" },
			{ label: "English Foxhound", value: 157, name: "dogsBreed" },
			{ label: "English Setter", value: 158, name: "dogsBreed" },
			{ label: "English Springer Spaniel", value: 159, name: "dogsBreed" },
			{ label: "English Toy Spaniel", value: 160, name: "dogsBreed" },
			{ label: "Entlebucher Mountain Dog", value: 161, name: "dogsBreed" },
			{ label: "Estrela Mountain Dog", value: 162, name: "dogsBreed" },
			{ label: "Eurasier", value: 163, name: "dogsBreed" },
			{ label: "Field Spaniel", value: 164, name: "dogsBreed" },
			{ label: "Finnish Lapphund", value: 165, name: "dogsBreed" },
			{ label: "Finnish Spitz", value: 166, name: "dogsBreed" },
			{ label: "Flat-Coated Retriever", value: 167, name: "dogsBreed" },
			{ label: "Fox Terrier", value: 168, name: "dogsBreed" },
			{ label: "French Bulldog", value: 169, name: "dogsBreed" },
			{ label: "French Spaniel", value: 170, name: "dogsBreed" },
			{ label: "Frenchton", value: 171, name: "dogsBreed" },
			{ label: "Frengle", value: 172, name: "dogsBreed" },
			{ label: "German Pinscher", value: 173, name: "dogsBreed" },
			{ label: "German Shepherd Dog", value: 174, name: "dogsBreed" },
			{ label: "German Shepherd Pit Bull", value: 175, name: "dogsBreed" },
			{ label: "German Sheprador", value: 176, name: "dogsBreed" },
			{ label: "German Shorthaired Pointer", value: 177, name: "dogsBreed" },
			{ label: "German Spitz", value: 178, name: "dogsBreed" },
			{ label: "German Wirehaired Pointer", value: 179, name: "dogsBreed" },
			{ label: "Giant Schnauzer", value: 180, name: "dogsBreed" },
			{ label: "Glen of Imaal Terrier", value: 181, name: "dogsBreed" },
			{ label: "Goberian", value: 182, name: "dogsBreed" },
			{ label: "Goldador", value: 183, name: "dogsBreed" },
			{ label: "Golden Cocker Retriever", value: 184, name: "dogsBreed" },
			{ label: "Golden Mountain Dog", value: 185, name: "dogsBreed" },
			{ label: "Golden Retriever", value: 186, name: "dogsBreed" },
			{ label: "Golden Retriever Corgi", value: 187, name: "dogsBreed" },
			{ label: "Golden Shepherd", value: 188, name: "dogsBreed" },
			{ label: "Goldendoodle", value: 189, name: "dogsBreed" },
			{ label: "Gollie", value: 190, name: "dogsBreed" },
			{ label: "Gordon Setter", value: 191, name: "dogsBreed" },
			{ label: "Great Dane", value: 192, name: "dogsBreed" },
			{ label: "Great Pyrenees", value: 193, name: "dogsBreed" },
			{ label: "Greater Swiss Mountain Dog", value: 194, name: "dogsBreed" },
			{ label: "Greyador", value: 195, name: "dogsBreed" },
			{ label: "Greyhound", value: 196, name: "dogsBreed" },
			{ label: "Hamiltonstovare", value: 197, name: "dogsBreed" },
			{ label: "Hanoverian Scenthound", value: 198, name: "dogsBreed" },
			{ label: "Harrier", value: 199, name: "dogsBreed" },
			{ label: "Havanese", value: 200, name: "dogsBreed" },
			{ label: "Hokkaido", value: 201, name: "dogsBreed" },
			{ label: "Horgi", value: 202, name: "dogsBreed" },
			{ label: "Huskita", value: 203, name: "dogsBreed" },
			{ label: "Huskydoodle", value: 204, name: "dogsBreed" },
			{ label: "Ibizan Hound", value: 205, name: "dogsBreed" },
			{ label: "Icelandic Sheepdog", value: 206, name: "dogsBreed" },
			{ label: "Irish Red and White Setter", value: 207, name: "dogsBreed" },
			{ label: "Irish Setter", value: 208, name: "dogsBreed" },
			{ label: "Irish Terrier", value: 209, name: "dogsBreed" },
			{ label: "Irish Water Spaniel", value: 210, name: "dogsBreed" },
			{ label: "Irish Wolfhound", value: 211, name: "dogsBreed" },
			{ label: "Italian Greyhound", value: 212, name: "dogsBreed" },
			{ label: "Jack-A-Poo", value: 213, name: "dogsBreed" },
			{ label: "Jack Chi", value: 214, name: "dogsBreed" },
			{ label: "Jack Russell Terrier", value: 215, name: "dogsBreed" },
			{ label: "Jackshund", value: 216, name: "dogsBreed" },
			{ label: "Japanese Chin", value: 217, name: "dogsBreed" },
			{ label: "Japanese Spitz", value: 218, name: "dogsBreed" },
			{ label: "Korean Jindo Dog", value: 219, name: "dogsBreed" },
			{ label: "Karelian Bear Dog", value: 220, name: "dogsBreed" },
			{ label: "Keeshond", value: 221, name: "dogsBreed" },
			{ label: "Kerry Blue Terrier", value: 222, name: "dogsBreed" },
			{ label: "King Shepherd", value: 223, name: "dogsBreed" },
			{ label: "Komondor", value: 224, name: "dogsBreed" },
			{ label: "Kooikerhondje", value: 225, name: "dogsBreed" },
			{ label: "Kuvasz", value: 226, name: "dogsBreed" },
			{ label: "Kyi-Leo", value: 227, name: "dogsBreed" },
			{ label: "Lab Pointer", value: 228, name: "dogsBreed" },
			{ label: "Labernese", value: 229, name: "dogsBreed" },
			{ label: "Labmaraner", value: 230, name: "dogsBreed" },
			{ label: "Labrabull", value: 231, name: "dogsBreed" },
			{ label: "Labradane", value: 232, name: "dogsBreed" },
			{ label: "Labradoodle", value: 233, name: "dogsBreed" },
			{ label: "Labrador Retriever", value: 234, name: "dogsBreed" },
			{ label: "Labrastaff", value: 235, name: "dogsBreed" },
			{ label: "Labsky", value: 236, name: "dogsBreed" },
			{ label: "Lagotto Romagnolo", value: 237, name: "dogsBreed" },
			{ label: "Lakeland Terrier", value: 238, name: "dogsBreed" },
			{ label: "Lancashire Heeler", value: 239, name: "dogsBreed" },
			{ label: "Leonberger", value: 240, name: "dogsBreed" },
			{ label: "Lhasa Apso", value: 241, name: "dogsBreed" },
			{ label: "Lhasapoo", value: 242, name: "dogsBreed" },
			{ label: "Lowchen", value: 243, name: "dogsBreed" },
			{ label: "Maltese", value: 244, name: "dogsBreed" },
			{ label: "Maltese Shih Tzu", value: 245, name: "dogsBreed" },
			{ label: "Maltipoo", value: 246, name: "dogsBreed" },
			{ label: "Manchester Terrier", value: 247, name: "dogsBreed" },
			{ label: "Mastador", value: 248, name: "dogsBreed" },
			{ label: "Mastiff", value: 249, name: "dogsBreed" },
			{ label: "Miniature Pinscher", value: 250, name: "dogsBreed" },
			{ label: "Miniature Schnauzer", value: 251, name: "dogsBreed" },
			{ label: "Morkie", value: 252, name: "dogsBreed" },
			{ label: "Mudi", value: 253, name: "dogsBreed" },
			{ label: "Mutt", value: 254, name: "dogsBreed" },
			{ label: "Neapolitan Mastiff", value: 255, name: "dogsBreed" },
			{ label: "Newfoundland", value: 256, name: "dogsBreed" },
			{ label: "Norfolk Terrier", value: 257, name: "dogsBreed" },
			{ label: "Norwegian Buhund", value: 258, name: "dogsBreed" },
			{ label: "Norwegian Elkhound", value: 259, name: "dogsBreed" },
			{ label: "Norwegian Lundehund", value: 260, name: "dogsBreed" },
			{ label: "Norwich Terrier", value: 261, name: "dogsBreed" },
			{ label: "Nova Scotia Duck Tolling Retriever", value: 262, name: "dogsBreed" },
			{ label: "Old English Sheepdog", value: 263, name: "dogsBreed" },
			{ label: "Otterhound", value: 264, name: "dogsBreed" },
			{ label: "Papillon", value: 265, name: "dogsBreed" },
			{ label: "Papipoo", value: 266, name: "dogsBreed" },
			{ label: "Peekapoo", value: 267, name: "dogsBreed" },
			{ label: "Pekingese", value: 268, name: "dogsBreed" },
			{ label: "Pembroke Welsh Corgi", value: 269, name: "dogsBreed" },
			{ label: "Petit Basset Griffon Vendeen", value: 270, name: "dogsBreed" },
			{ label: "Pharaoh Hound", value: 271, name: "dogsBreed" },
			{ label: "Pitsky", value: 272, name: "dogsBreed" },
			{ label: "Plott", value: 273, name: "dogsBreed" },
			{ label: "Pocket Beagle", value: 274, name: "dogsBreed" },
			{ label: "Pointer", value: 275, name: "dogsBreed" },
			{ label: "Polish Lowland Sheepdog", value: 276, name: "dogsBreed" },
			{ label: "Pomapoo", value: 277, name: "dogsBreed" },
			{ label: "Pomchi", value: 278, name: "dogsBreed" },
			{ label: "Pomeagle", value: 279, name: "dogsBreed" },
			{ label: "Pomeranian", value: 280, name: "dogsBreed" },
			{ label: "Pomsky", value: 281, name: "dogsBreed" },
			{ label: "Poochon", value: 282, name: "dogsBreed" },
			{ label: "Poodle", value: 283, name: "dogsBreed" },
			{ label: "Portuguese Podengo Pequeno", value: 284, name: "dogsBreed" },
			{ label: "Portuguese Water Dog", value: 285, name: "dogsBreed" },
			{ label: "Pug", value: 286, name: "dogsBreed" },
			{ label: "Pugalier", value: 287, name: "dogsBreed" },
			{ label: "Puggle", value: 288, name: "dogsBreed" },
			{ label: "Puginese", value: 289, name: "dogsBreed" },
			{ label: "Puli", value: 290, name: "dogsBreed" },
			{ label: "Pyredoodle", value: 291, name: "dogsBreed" },
			{ label: "Pyrenean Shepherd", value: 292, name: "dogsBreed" },
			{ label: "Rat Terrier", value: 293, name: "dogsBreed" },
			{ label: "Redbone Coonhound", value: 294, name: "dogsBreed" },
			{ label: "Rhodesian Ridgeback", value: 295, name: "dogsBreed" },
			{ label: "Rottador", value: 296, name: "dogsBreed" },
			{ label: "Rottle", value: 297, name: "dogsBreed" },
			{ label: "Rottweiler", value: 298, name: "dogsBreed" },
			{ label: "Saint Berdoodle", value: 299, name: "dogsBreed" },
			{ label: "Saint Bernard", value: 300, name: "dogsBreed" },
			{ label: "Saluki", value: 301, name: "dogsBreed" },
			{ label: "Samoyed", value: 302, name: "dogsBreed" },
			{ label: "Samusky", value: 303, name: "dogsBreed" },
			{ label: "Schipperke", value: 304, name: "dogsBreed" },
			{ label: "Schnoodle", value: 305, name: "dogsBreed" },
			{ label: "Scottish Deerhound", value: 306, name: "dogsBreed" },
			{ label: "Scottish Terrier", value: 307, name: "dogsBreed" },
			{ label: "Sealyham Terrier", value: 308, name: "dogsBreed" },
			{ label: "Sheepadoodle", value: 309, name: "dogsBreed" },
			{ label: "Shepsky", value: 310, name: "dogsBreed" },
			{ label: "Shetland Sheepdog", value: 311, name: "dogsBreed" },
			{ label: "Shiba Inu", value: 312, name: "dogsBreed" },
			{ label: "Shichon", value: 313, name: "dogsBreed" },
			{ label: "Shih-Poo", value: 314, name: "dogsBreed" },
			{ label: "Shih Tzu", value: 315, name: "dogsBreed" },
			{ label: "Shiloh Shepherd", value: 316, name: "dogsBreed" },
			{ label: "Shiranian", value: 317, name: "dogsBreed" },
			{ label: "Shollie", value: 318, name: "dogsBreed" },
			{ label: "Shorkie", value: 319, name: "dogsBreed" },
			{ label: "Siberian Husky", value: 320, name: "dogsBreed" },
			{ label: "Silken Windhound", value: 321, name: "dogsBreed" },
			{ label: "Silky Terrier", value: 322, name: "dogsBreed" },
			{ label: "Skye Terrier", value: 323, name: "dogsBreed" },
			{ label: "Sloughi", value: 324, name: "dogsBreed" },
			{ label: "Small Munsterlander Pointer", value: 325, name: "dogsBreed" },
			{ label: "Soft Coated Wheaten Terrier", value: 326, name: "dogsBreed" },
			{ label: "Spanish Mastiff", value: 327, name: "dogsBreed" },
			{ label: "Spinone Italiano", value: 328, name: "dogsBreed" },
			{ label: "Springador", value: 329, name: "dogsBreed" },
			{ label: "Stabyhoun", value: 330, name: "dogsBreed" },
			{ label: "Staffordshire Bull Terrier", value: 331, name: "dogsBreed" },
			{ label: "Standard Schnauzer", value: 332, name: "dogsBreed" },
			{ label: "Sussex Spaniel", value: 333, name: "dogsBreed" },
			{ label: "Swedish Vallhund", value: 334, name: "dogsBreed" },
			{ label: "Terripoo", value: 335, name: "dogsBreed" },
			{ label: "Texas Heeler", value: 336, name: "dogsBreed" },
			{ label: "Tibetan Mastiff", value: 337, name: "dogsBreed" },
			{ label: "Tibetan Spaniel", value: 338, name: "dogsBreed" },
			{ label: "Tibetan Terrier", value: 339, name: "dogsBreed" },
			{ label: "Toy Fox Terrier", value: 340, name: "dogsBreed" },
			{ label: "Treeing Tennessee Brindle", value: 341, name: "dogsBreed" },
			{ label: "Treeing Walker Coonhound", value: 342, name: "dogsBreed" },
			{ label: "Valley Bulldog", value: 343, name: "dogsBreed" },
			{ label: "Vizsla", value: 344, name: "dogsBreed" },
			{ label: "Weimaraner", value: 345, name: "dogsBreed" },
			{ label: "Welsh Springer Spaniel", value: 346, name: "dogsBreed" },
			{ label: "Welsh Terrier", value: 347, name: "dogsBreed" },
			{ label: "West Highland White Terrier", value: 348, name: "dogsBreed" },
			{ label: "Westiepoo", value: 349, name: "dogsBreed" },
			{ label: "Whippet", value: 350, name: "dogsBreed" },
			{ label: "Whoodle", value: 351, name: "dogsBreed" },
			{ label: "Wirehaired Pointing Griffon", value: 352, name: "dogsBreed" },
			{ label: "Xoloitzcuintli", value: 353, name: "dogsBreed" },
			{ label: "Yorkipoo", value: 354, name: "dogsBreed" },
			{ label: "Yorkshire Terrier", value: 355, name: "dogsBreed" }
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
		let classBoxEmailValid = ["email-valid"];
		if(this.state.order.emailIsValid) {
			classBoxEmailValid.push('active');
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
						<input className="css-yk16xz-control" type="text" name="customerEmail" value={this.state.order.customerEmail} onChange={this.emailValidate} />
						<span className={classBoxEmailValid.join(' ')}><MdDone /></span>
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
