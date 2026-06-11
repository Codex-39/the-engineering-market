export const STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

export const CITIES = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Tezpur'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
  'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Kurukshetra'],
  'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Solan', 'Hamirpur'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad'],
  'Manipur': ['Imphal'],
  'Meghalaya': ['Shillong'],
  'Mizoram': ['Aizawl'],
  'Nagaland': ['Kohima', 'Dimapur'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Sambalpur'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer'],
  'Sikkim': ['Gangtok'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
  'Tripura': ['Agartala'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Noida', 'Ghaziabad', 'Agra', 'Varanasi', 'Allahabad'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'],
  'Andaman and Nicobar Islands': ['Port Blair'],
  'Chandigarh': ['Chandigarh'],
  'Dadra and Nagar Haveli and Daman and Diu': ['Daman', 'Diu', 'Silvassa'],
  'Delhi': ['New Delhi', 'Delhi NCR'],
  'Jammu and Kashmir': ['Srinagar', 'Jammu'],
  'Ladakh': ['Leh', 'Kargil'],
  'Lakshadweep': ['Kavaratti'],
  'Puducherry': ['Puducherry', 'Karaikal']
};

export const COLLEGES = {
  // Let's seed colleges dynamically or statically. Since the requirements say:
  // "College should be searchable and allow custom entry."
  // We can seed a few major colleges per state/city, but also handle custom entry!
  'Delhi-New Delhi': ['Indian Institute of Technology Delhi (IITD)', 'Delhi Technological University (DTU)', 'Netaji Subhas University of Technology (NSUT)', 'National Institute of Technology Delhi (NITD)'],
  'Maharashtra-Mumbai': ['Indian Institute of Technology Bombay (IITB)', 'Veermata Jijabai Technological Institute (VJTI)', 'K. J. Somaiya College of Engineering'],
  'Maharashtra-Pune': ['College of Engineering Pune (COEP)', 'Pune Institute of Computer Technology (PICT)', 'Maharashtra Institute of Technology (MIT)'],
  'Karnataka-Bengaluru': ['Indian Institute of Science (IISc)', 'R. V. College of Engineering (RVCE)', 'PES University', 'B.M.S. College of Engineering (BMSCE)'],
  'Tamil Nadu-Chennai': ['Indian Institute of Technology Madras (IITM)', 'College of Engineering, Guindy (Anna University)', 'SRM Institute of Science and Technology'],
  'West Bengal-Kolkata': ['Jadavpur University', 'Indian Institute of Engineering Science and Technology (IIEST) Shibpur', 'Heritage Institute of Technology'],
  'Uttar Pradesh-Noida': ['Amity University', 'Jaypee Institute of Information Technology'],
  'Uttar Pradesh-Kanpur': ['Indian Institute of Technology Kanpur (IITK)'],
  'Telangana-Hyderabad': ['Indian Institute of Technology Hyderabad (IITH)', 'International Institute of Information Technology Hyderabad (IIITH)', 'JNTU Hyderabad', 'BITS Pilani Hyderabad Campus'],
  'Gujarat-Gandhinagar': ['Indian Institute of Technology Gandhinagar (IITGN)', 'Dhirubhai Ambani Institute of Information and Communication Technology (DA-IICT)'],
  'Rajasthan-Jaipur': ['Malaviya National Institute of Technology (MNIT) Jaipur', 'Manipal University Jaipur'],
  'Uttarakhand-Roorkee': ['Indian Institute of Technology Roorkee (IITR)'],
  'Punjab-Amritsar': ['Guru Nanak Dev University'],
  'Punjab-Patiala': ['Thapar Institute of Engineering and Technology']
};

// Helper function to query colleges by state & city
export const getCollegesList = (state, city) => {
  const key = `${state}-${city}`;
  return COLLEGES[key] || [];
};
