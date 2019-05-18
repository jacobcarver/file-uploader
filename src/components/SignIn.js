import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loginUser, signOut } from '../redux/actions/actions';

const API_URL = 'https://file-upload-db.herokuapp.com'

class SignIn extends Component {
	constructor() {
		super();
		this.state = {
			lusername: '',
			lpassword: '',
			remail: '',
			rusername: '',
			rpassword: '',
			showLogin: true,
			id: '',
			user: {},
			error: '',
			message: ''
		}
		this.handleInput = this.handleInput.bind(this);
		this.loginSubmit = this.loginSubmit.bind(this);
		this.registerSubmit = this.registerSubmit.bind(this);
		this.changeForm = this.changeForm.bind(this);
		this.logout = this.logout.bind(this);
	}
	handleInput(e) {
		this.setState({ [e.target.id]: e.target.value });
	}
	loginSubmit(e) {
		e.preventDefault();
		const login = {
			username: this.state.lusername.toLowerCase(),
			password: this.state.lpassword
		}
		axios.post(`${API_URL}/login`, login)
			.then((res) => {
				if(res.data.username !== undefined) {
					this.props.loginUser(res.data);
					this.setState({ lusername: '', lpassword: '', user: res.data });
					setTimeout(() => {
						window.location.pathname = '/uploads';
					}, 500);
				} else {
					this.setState({ error: res.data })
					setTimeout(() => {
						this.setState({ error: '' })
					}, 3500)
				}
				localStorage.setItem('user', JSON.stringify(this.props.user));
			}).catch((err) => {
				if (err.response !== undefined) {
					this.setState({ error: 'Too many attempts, please try again later' });
				}
			});
	}
	registerSubmit(e) {
		e.preventDefault();
		const newUser = {
			email: this.state.remail.toLowerCase(),
			username: this.state.rusername.toLowerCase(),
			password: this.state.rpassword
		}
		axios.post(`${API_URL}/register`, newUser).then((res) => {
			if (res.status === 200) {
				this.setState({ remail: '', rusername: '', rpassword: '' });
				setTimeout(() => {
					window.location.pathname = '/signin';
				}, 1000);
			}
			if (res.status === 201) {
				this.setState({ error: res.data });
				setTimeout(() => { this.setState({ error: '' })}, 2000);
			}
		}).catch((err) => {
			if (typeof(err.response) === 'object') {
				if (err.response.status === 429) {
				this.setState({ error: err.response.data });
				setTimeout(() => { this.setState({ error: '' })}, 2000);
			}
			if (err.response.status === 404) {
				this.setState({ message: `Registration Successful!`, remail: '', rusername: '', rpassword: '' });
				setTimeout(() => { this.setState({ message: '' })}, 2000);
			}
			}
		});
	}
	changeForm() {
		this.setState({ showLogin: !this.state.showLogin, lusername: '', lpassword: '', remail: '', rusername: '', rpassword: '' })
	}
	logout() {
		this.props.signOut();
		localStorage.clear();
	}
	render() {
		const { user } = this.props;
		return (
			<div id="signin">

				{/* Show Login form if not logged in */}
				{this.state.showLogin === true && user.username === null ? 
				<form onSubmit={this.loginSubmit} className="form mb-5">
					{/* Login Form */}
					<h1 style={{color: '#F12C61'}} className="mb-5">Login</h1>
					<div className="input-group mb-5">
						<div className="input-group-prepend">
							<span className="input-group-text"><i className="fas fa-user"></i></span>
						</div>
						<input onChange={this.handleInput} value={this.state.lusername} type="text" name="lusername" id="lusername" className="form-control" placeholder="Username" aria-label="Username" required />
					</div>

					<div className="input-group mb-5">
						<div className="input-group-prepend">
							<span className="input-group-text"><i className="fas fa-key"></i></span>
						</div>
						<input onChange={this.handleInput} value={this.state.lpassword} type="password" name="lpassword" id="lpassword" className="form-control" placeholder="Password" aria-label="Password" required />
					</div>

					<div className="form-group text-right">
						<button style={{color: '#F12C61'}} type="submit" name="lsubmit" className="p-0 btn btn-white btn-md outline text-align-right">Sign In <i className="pl-2 fas fa-arrow-right"></i></button>
					</div>
					<div className="text-left">
						<button className="p-0 btn btn-white text-white" onClick={this.changeForm}>Don't have an account? <span className="text-primary pl-1">Register</span></button>
					</div>
				</form>
				: null }

				{/* Show Register form if not logged in */}
				{this.state.showLogin === false && user.username === null ?
				<form onSubmit={this.registerSubmit} className="form mb-5">
					{/* Register Form */}
					<h1 style={{color: '#F12C61'}} className="mb-5">Create Account</h1>

					<div className="input-group mb-5">
						<div className="input-group-prepend">
							<span className="input-group-text"><i className="fas fa-envelope"></i></span>
						</div>
						<input onChange={this.handleInput} value={this.state.remail} type="email" name="remail" id="remail" className="form-control" placeholder="Email" aria-label="Email" required />
					</div>

					<div className="input-group mb-5">
						<div className="input-group-prepend">
							<span className="input-group-text"><i className="fas fa-user"></i></span>
						</div>
						<input onChange={this.handleInput} value={this.state.rusername} type="text" name="rusername" id="rusername" className="form-control" placeholder="Username" aria-label="Username" required />
					</div>

					<div className="input-group mb-5">
						<div className="input-group-prepend">
							<span className="input-group-text"><i className="fas fa-key"></i></span>
						</div>
						<input onChange={this.handleInput} value={this.state.rpassword} type="password" name="rpassword" id="rpassword" className="form-control" placeholder="Password" aria-label="Password" required />
					</div>

					<div className="form-group text-right">
						<button style={{color: '#F12C61'}} type="submit" name="rsubmit" className="p-0 btn btn-white btn-md">Sign Up <i className="pl-2 fas fa-arrow-right"></i></button>
					</div>
					<div className="text-left">
						<button className="p-0 btn text-white" onClick={this.changeForm}>Already have an account? <span className="text-primary pl-1">Login</span></button>
					</div>
				</form> : null }


				{/* Login Success Alert */}
				{this.state.user.username !== undefined ?
				<div className="alert alert-success" role="alert">
					{`Welcome, ${this.state.user.username}`}
				</div> : null}
				
				{/* Login Fail Alert */}
				{this.state.error.length > 0 ? 
				<div className="alert alert-warning" role="alert">
					{this.state.error}
				</div> : null}

				{/* Register Success Alert */}
				{this.state.message.length > 0 ?
				<div className="alert alert-success" role="alert">
					{this.state.message}
				</div> : null}

				{user.email !== null && user.username !== null && user.password !== null ? <p className="text-white">Already signed in, do you want to <span className="text-danger" onClick={this.logout}>sign out</span></p> : null}

			</div>
		)
	}
}

SignIn.propTypes = {
	user: PropTypes.object.isRequired,
	loginUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    user: state.siteData.user,
});

export default connect(mapStateToProps, { loginUser, signOut })(SignIn);