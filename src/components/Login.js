import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loginRole, setLoginRole] = useState('STUDENT'); // Track which role is logging in
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country_code: '+91',
    state: '',
    district: '',
    country: 'India',
    password: '',
    role: 'STUDENT'
  });
  const [usePhone, setUsePhone] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = usePhone 
        ? { phone: formData.phone, password: formData.password }
        : { email: formData.email, password: formData.password };

      const response = await axios.post('http://127.0.0.1:8000/api/login/', data);
      setUser(response.data.user);
      navigate('/users');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
      if (err.response?.data?.remaining_attempts) {
        setError(`Invalid credentials. ${err.response.data.remaining_attempts} attempt(s) remaining.`);
      }
      if (err.response?.data?.try_another_way) {
        setError(err.response.data.error + ' Try logging in with phone number instead.');
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users/', {
        name: formData.name,
        email: formData.email,
        country_code: formData.country_code,
        phone: formData.phone,
        state: formData.state,
        district: formData.district,
        country: formData.country,
        password: formData.password,
        role: formData.role,
        status: 'ACTIVE'
      });
      
      // Auto login after registration
      setSuccess('Registration successful! Redirecting...');
      
      // Set user and navigate based on role
      const newUser = response.data;
      setUser(newUser);
      
      setTimeout(() => {
        if (newUser.role === 'STAFF') {
          navigate('/staff-dashboard');
        } else if (newUser.role === 'ADMIN') {
          navigate('/admin-dashboard');
        } else {
          navigate('/bookings');
        }
      }, 1500);
      
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.email) {
        setError('Email already registered. Please use a different email or login.');
      } else if (errorData?.phone) {
        setError('Phone number already registered. Please use a different number or login.');
      } else if (errorData?.name) {
        setError('Name: ' + errorData.name[0]);
      } else if (errorData?.password) {
        setError('Password: ' + errorData.password[0]);
      } else {
        setError('Registration failed. Please check all fields and try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="hero-content">
          <h1 className="hero-title">Campus Resource Management System</h1>
          <p className="hero-subtitle">Streamline your campus resource booking with ease</p>
          
          <div className="features">
            <div className="feature-item">
              <div className="feature-icon">👥</div>
              <div>
                <h3>User Management</h3>
                <p>Manage students and staff efficiently</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">🏢</div>
              <div>
                <h3>Resource Booking</h3>
                <p>Book labs, classrooms, and event halls</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <div>
                <h3>Secure Access</h3>
                <p>Protected with authentication and validation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-header">
            <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p>{isLogin ? 'Sign in to continue to your account' : 'Register to get started'}</p>
          </div>

          {isLogin && (
            <div className="role-tabs">
              <button
                type="button"
                className={`role-tab ${loginRole === 'STUDENT' ? 'active' : ''}`}
                onClick={() => setLoginRole('STUDENT')}
              >
                👨‍🎓 Student
              </button>
              <button
                type="button"
                className={`role-tab ${loginRole === 'STAFF' ? 'active' : ''}`}
                onClick={() => setLoginRole('STAFF')}
              >
                👨‍🏫 Staff
              </button>
              <button
                type="button"
                className={`role-tab ${loginRole === 'ADMIN' ? 'active' : ''}`}
                onClick={() => setLoginRole('ADMIN')}
              >
                👨‍💼 Admin
              </button>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form onSubmit={isLogin ? handleLogin : handleRegister} className="login-form">
            {isLogin && (
              <div className="toggle-container">
                <button
                  type="button"
                  className={`toggle-btn ${!usePhone ? 'active' : ''}`}
                  onClick={() => setUsePhone(false)}
                >
                  Email
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${usePhone ? 'active' : ''}`}
                  onClick={() => setUsePhone(true)}
                >
                  Phone
                </button>
              </div>
            )}

            {!isLogin && (
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name-new"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter your name"
                  autoComplete="new-password"
                  required
                />
              </div>
            )}

            {(!isLogin || !usePhone) && (
              <div className="input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email-new"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter your email"
                  autoComplete="new-password"
                  required
                />
              </div>
            )}

            {(!isLogin || usePhone) && (
              <>
                <div className="input-group">
                  <label>Phone Number</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select
                      value={formData.country_code || '+91'}
                      onChange={(e) => setFormData({...formData, country_code: e.target.value})}
                      style={{ width: '120px' }}
                    >
                      <option value="+93">🇦🇫 +93</option>
                      <option value="+355">🇦🇱 +355</option>
                      <option value="+213">🇩🇿 +213</option>
                      <option value="+376">🇦🇩 +376</option>
                      <option value="+244">🇦🇴 +244</option>
                      <option value="+54">🇦🇷 +54</option>
                      <option value="+374">🇦🇲 +374</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+43">🇦🇹 +43</option>
                      <option value="+880">🇧🇩 +880</option>
                      <option value="+32">🇧🇪 +32</option>
                      <option value="+55">🇧🇷 +55</option>
                      <option value="+1">🇨🇦 +1</option>
                      <option value="+86">🇨🇳 +86</option>
                      <option value="+45">🇩🇰 +45</option>
                      <option value="+20">🇪🇬 +20</option>
                      <option value="+33">🇫🇷 +33</option>
                      <option value="+49">🇩🇪 +49</option>
                      <option value="+30">🇬🇷 +30</option>
                      <option value="+852">🇭🇰 +852</option>
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+62">🇮🇩 +62</option>
                      <option value="+98">🇮🇷 +98</option>
                      <option value="+964">🇮🇶 +964</option>
                      <option value="+353">🇮🇪 +353</option>
                      <option value="+972">🇮🇱 +972</option>
                      <option value="+39">🇮🇹 +39</option>
                      <option value="+81">🇯🇵 +81</option>
                      <option value="+254">🇰🇪 +254</option>
                      <option value="+82">🇰🇷 +82</option>
                      <option value="+965">🇰🇼 +965</option>
                      <option value="+60">🇲🇾 +60</option>
                      <option value="+52">🇲🇽 +52</option>
                      <option value="+31">🇳🇱 +31</option>
                      <option value="+64">🇳🇿 +64</option>
                      <option value="+234">🇳🇬 +234</option>
                      <option value="+47">🇳🇴 +47</option>
                      <option value="+92">🇵🇰 +92</option>
                      <option value="+63">🇵🇭 +63</option>
                      <option value="+48">🇵🇱 +48</option>
                      <option value="+351">🇵🇹 +351</option>
                      <option value="+974">🇶🇦 +974</option>
                      <option value="+7">🇷🇺 +7</option>
                      <option value="+966">🇸🇦 +966</option>
                      <option value="+65">🇸🇬 +65</option>
                      <option value="+27">🇿🇦 +27</option>
                      <option value="+34">🇪🇸 +34</option>
                      <option value="+94">🇱🇰 +94</option>
                      <option value="+46">🇸🇪 +46</option>
                      <option value="+41">🇨🇭 +41</option>
                      <option value="+66">🇹🇭 +66</option>
                      <option value="+90">🇹🇷 +90</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+84">🇻🇳 +84</option>
                    </select>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="Enter 10-digit phone"
                      required
                      maxLength="10"
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
              </>
            )}

            {!isLogin && (
              <>
                <div className="input-group">
                  <label>Country</label>
                  <select
                    value={formData.country || 'India'}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                  >
                    <option value="">Select Country</option>
                    <option value="Afghanistan">🇦🇫 Afghanistan</option>
                    <option value="Albania">🇦🇱 Albania</option>
                    <option value="Algeria">🇩🇿 Algeria</option>
                    <option value="Argentina">🇦🇷 Argentina</option>
                    <option value="Australia">🇦🇺 Australia</option>
                    <option value="Austria">🇦🇹 Austria</option>
                    <option value="Bangladesh">🇧🇩 Bangladesh</option>
                    <option value="Belgium">🇧🇪 Belgium</option>
                    <option value="Brazil">🇧🇷 Brazil</option>
                    <option value="Canada">🇨🇦 Canada</option>
                    <option value="China">🇨🇳 China</option>
                    <option value="Denmark">🇩🇰 Denmark</option>
                    <option value="Egypt">🇪🇬 Egypt</option>
                    <option value="France">🇫🇷 France</option>
                    <option value="Germany">🇩🇪 Germany</option>
                    <option value="Greece">🇬🇷 Greece</option>
                    <option value="Hong Kong">🇭🇰 Hong Kong</option>
                    <option value="India">🇮🇳 India</option>
                    <option value="Indonesia">🇮🇩 Indonesia</option>
                    <option value="Iran">🇮🇷 Iran</option>
                    <option value="Iraq">🇮🇶 Iraq</option>
                    <option value="Ireland">🇮🇪 Ireland</option>
                    <option value="Israel">🇮🇱 Israel</option>
                    <option value="Italy">🇮🇹 Italy</option>
                    <option value="Japan">🇯🇵 Japan</option>
                    <option value="Kenya">🇰🇪 Kenya</option>
                    <option value="South Korea">🇰🇷 South Korea</option>
                    <option value="Kuwait">🇰🇼 Kuwait</option>
                    <option value="Malaysia">🇲🇾 Malaysia</option>
                    <option value="Mexico">🇲🇽 Mexico</option>
                    <option value="Netherlands">🇳🇱 Netherlands</option>
                    <option value="New Zealand">🇳🇿 New Zealand</option>
                    <option value="Nigeria">🇳🇬 Nigeria</option>
                    <option value="Norway">🇳🇴 Norway</option>
                    <option value="Pakistan">🇵🇰 Pakistan</option>
                    <option value="Philippines">🇵🇭 Philippines</option>
                    <option value="Poland">🇵🇱 Poland</option>
                    <option value="Portugal">🇵🇹 Portugal</option>
                    <option value="Qatar">🇶🇦 Qatar</option>
                    <option value="Russia">🇷🇺 Russia</option>
                    <option value="Saudi Arabia">🇸🇦 Saudi Arabia</option>
                    <option value="Singapore">🇸🇬 Singapore</option>
                    <option value="South Africa">🇿🇦 South Africa</option>
                    <option value="Spain">🇪🇸 Spain</option>
                    <option value="Sri Lanka">🇱🇰 Sri Lanka</option>
                    <option value="Sweden">🇸🇪 Sweden</option>
                    <option value="Switzerland">🇨🇭 Switzerland</option>
                    <option value="Thailand">🇹🇭 Thailand</option>
                    <option value="Turkey">🇹🇷 Turkey</option>
                    <option value="UAE">🇦🇪 United Arab Emirates</option>
                    <option value="UK">🇬🇧 United Kingdom</option>
                    <option value="USA">🇺🇸 United States</option>
                    <option value="Vietnam">🇻🇳 Vietnam</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>State</label>
                  <select
                    value={formData.state || ''}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                  >
                    <option value="">Select State</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                    <option value="Chandigarh">Chandigarh</option>
                    <option value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</option>
                    <option value="Daman and Diu">Daman and Diu</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                    <option value="Ladakh">Ladakh</option>
                    <option value="Lakshadweep">Lakshadweep</option>
                    <option value="Puducherry">Puducherry</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>District</label>
                  <select
                    value={formData.district || ''}
                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                  >
                    <option value="">Select District</option>
                    
                    {/* Tamil Nadu Districts */}
                    <optgroup label="Tamil Nadu">
                      <option value="Ariyalur">Ariyalur</option>
                      <option value="Chengalpattu">Chengalpattu</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Coimbatore">Coimbatore</option>
                      <option value="Cuddalore">Cuddalore</option>
                      <option value="Dharmapuri">Dharmapuri</option>
                      <option value="Dindigul">Dindigul</option>
                      <option value="Erode">Erode</option>
                      <option value="Kallakurichi">Kallakurichi</option>
                      <option value="Kanchipuram">Kanchipuram</option>
                      <option value="Kanyakumari">Kanyakumari</option>
                      <option value="Karur">Karur</option>
                      <option value="Krishnagiri">Krishnagiri</option>
                      <option value="Madurai">Madurai</option>
                      <option value="Mayiladuthurai">Mayiladuthurai</option>
                      <option value="Nagapattinam">Nagapattinam</option>
                      <option value="Namakkal">Namakkal</option>
                      <option value="Nilgiris">Nilgiris</option>
                      <option value="Perambalur">Perambalur</option>
                      <option value="Pudukkottai">Pudukkottai</option>
                      <option value="Ramanathapuram">Ramanathapuram</option>
                      <option value="Ranipet">Ranipet</option>
                      <option value="Salem">Salem</option>
                      <option value="Sivaganga">Sivaganga</option>
                      <option value="Tenkasi">Tenkasi</option>
                      <option value="Thanjavur">Thanjavur</option>
                      <option value="Theni">Theni</option>
                      <option value="Thoothukudi">Thoothukudi</option>
                      <option value="Tiruchirappalli">Tiruchirappalli</option>
                      <option value="Tirunelveli">Tirunelveli</option>
                      <option value="Tirupathur">Tirupathur</option>
                      <option value="Tiruppur">Tiruppur</option>
                      <option value="Tiruvallur">Tiruvallur</option>
                      <option value="Tiruvannamalai">Tiruvannamalai</option>
                      <option value="Tiruvarur">Tiruvarur</option>
                      <option value="Vellore">Vellore</option>
                      <option value="Viluppuram">Viluppuram</option>
                      <option value="Virudhunagar">Virudhunagar</option>
                    </optgroup>

                    {/* Karnataka Districts */}
                    <optgroup label="Karnataka">
                      <option value="Bagalkot">Bagalkot</option>
                      <option value="Bangalore Rural">Bangalore Rural</option>
                      <option value="Bangalore Urban">Bangalore Urban</option>
                      <option value="Belgaum">Belgaum</option>
                      <option value="Bellary">Bellary</option>
                      <option value="Bidar">Bidar</option>
                      <option value="Chamarajanagar">Chamarajanagar</option>
                      <option value="Chikkaballapur">Chikkaballapur</option>
                      <option value="Chikkamagaluru">Chikkamagaluru</option>
                      <option value="Chitradurga">Chitradurga</option>
                      <option value="Dakshina Kannada">Dakshina Kannada</option>
                      <option value="Davanagere">Davanagere</option>
                      <option value="Dharwad">Dharwad</option>
                      <option value="Gadag">Gadag</option>
                      <option value="Hassan">Hassan</option>
                      <option value="Haveri">Haveri</option>
                      <option value="Kodagu">Kodagu</option>
                      <option value="Kolar">Kolar</option>
                      <option value="Koppal">Koppal</option>
                      <option value="Mandya">Mandya</option>
                      <option value="Mysore">Mysore</option>
                      <option value="Raichur">Raichur</option>
                      <option value="Ramanagara">Ramanagara</option>
                      <option value="Shimoga">Shimoga</option>
                      <option value="Tumkur">Tumkur</option>
                      <option value="Udupi">Udupi</option>
                      <option value="Uttara Kannada">Uttara Kannada</option>
                      <option value="Vijayapura">Vijayapura</option>
                      <option value="Yadgir">Yadgir</option>
                    </optgroup>

                    {/* Maharashtra Districts */}
                    <optgroup label="Maharashtra">
                      <option value="Ahmednagar">Ahmednagar</option>
                      <option value="Akola">Akola</option>
                      <option value="Amravati">Amravati</option>
                      <option value="Aurangabad">Aurangabad</option>
                      <option value="Beed">Beed</option>
                      <option value="Bhandara">Bhandara</option>
                      <option value="Buldhana">Buldhana</option>
                      <option value="Chandrapur">Chandrapur</option>
                      <option value="Dhule">Dhule</option>
                      <option value="Gadchiroli">Gadchiroli</option>
                      <option value="Gondia">Gondia</option>
                      <option value="Hingoli">Hingoli</option>
                      <option value="Jalgaon">Jalgaon</option>
                      <option value="Jalna">Jalna</option>
                      <option value="Kolhapur">Kolhapur</option>
                      <option value="Latur">Latur</option>
                      <option value="Mumbai City">Mumbai City</option>
                      <option value="Mumbai Suburban">Mumbai Suburban</option>
                      <option value="Nagpur">Nagpur</option>
                      <option value="Nanded">Nanded</option>
                      <option value="Nandurbar">Nandurbar</option>
                      <option value="Nashik">Nashik</option>
                      <option value="Osmanabad">Osmanabad</option>
                      <option value="Palghar">Palghar</option>
                      <option value="Parbhani">Parbhani</option>
                      <option value="Pune">Pune</option>
                      <option value="Raigad">Raigad</option>
                      <option value="Ratnagiri">Ratnagiri</option>
                      <option value="Sangli">Sangli</option>
                      <option value="Satara">Satara</option>
                      <option value="Sindhudurg">Sindhudurg</option>
                      <option value="Solapur">Solapur</option>
                      <option value="Thane">Thane</option>
                      <option value="Wardha">Wardha</option>
                      <option value="Washim">Washim</option>
                      <option value="Yavatmal">Yavatmal</option>
                    </optgroup>

                    {/* Kerala Districts */}
                    <optgroup label="Kerala">
                      <option value="Alappuzha">Alappuzha</option>
                      <option value="Ernakulam">Ernakulam</option>
                      <option value="Idukki">Idukki</option>
                      <option value="Kannur">Kannur</option>
                      <option value="Kasaragod">Kasaragod</option>
                      <option value="Kollam">Kollam</option>
                      <option value="Kottayam">Kottayam</option>
                      <option value="Kozhikode">Kozhikode</option>
                      <option value="Malappuram">Malappuram</option>
                      <option value="Palakkad">Palakkad</option>
                      <option value="Pathanamthitta">Pathanamthitta</option>
                      <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                      <option value="Thrissur">Thrissur</option>
                      <option value="Wayanad">Wayanad</option>
                    </optgroup>

                    {/* Delhi */}
                    <optgroup label="Delhi">
                      <option value="Central Delhi">Central Delhi</option>
                      <option value="East Delhi">East Delhi</option>
                      <option value="New Delhi">New Delhi</option>
                      <option value="North Delhi">North Delhi</option>
                      <option value="North East Delhi">North East Delhi</option>
                      <option value="North West Delhi">North West Delhi</option>
                      <option value="Shahdara">Shahdara</option>
                      <option value="South Delhi">South Delhi</option>
                      <option value="South East Delhi">South East Delhi</option>
                      <option value="South West Delhi">South West Delhi</option>
                      <option value="West Delhi">West Delhi</option>
                    </optgroup>

                    {/* Add more states as needed */}
                    <optgroup label="Other">
                      <option value="Other">Other (Type manually)</option>
                    </optgroup>
                  </select>
                </div>
              </>
            )}

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Enter your password"
                required
              />
            </div>

            {!isLogin && (
              <div className="input-group">
                <label>Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="STUDENT">Student</option>
                  <option value="STAFF">Staff</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            )}

            <button type="submit" className="login-btn">
              {isLogin ? 'Sign In' : 'Register'}
            </button>
          </form>

          <div className="switch-mode">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                  setFormData({ name: '', email: '', phone: '', password: '', role: 'STUDENT' });
                }}
                className="switch-btn"
              >
                {isLogin ? 'Register here' : 'Login here'}
              </button>
            </p>
            {isLogin && (
              <p style={{ marginTop: '1rem', padding: '0.75rem', background: '#e3f2fd', borderRadius: '6px', fontSize: '0.9rem', color: '#1976d2' }}>
                📌 <strong>Note:</strong> Student registrations require Staff and Admin approval before login access is granted.
              </p>
            )}
          </div>

          <div className="login-footer">
            <p>🎓 Campus Resource Management System 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
