/**
 * ============================================================================
 * GigCredit - Big Data Generator (150 Real-Life Gig Driver Profiles)
 * ============================================================================
 * 
 * Generates 150 realistic Swiggy, Zomato, Blinkit, Zepto, Uber & Porter driver
 * profiles with authentic multi-platform earning statements, ratings, bank
 * cashflows, and escrow repayment metrics across Indian metros.
 */

const FIRST_NAMES = ['Aarav', 'Ramesh', 'Suresh', 'Vikram', 'Priya', 'Gurpreet', 'Ananya', 'Rajesh', 'Amit', 'Deepak', 'Manish', 'Rahul', 'Sunil', 'Pooja', 'Neha', 'Karan', 'Vijay', 'Rohit', 'Sanjay', 'Ajay'];
const LAST_NAMES = ['Kumar', 'Sharma', 'Singh', 'Verma', 'Patel', 'Deshmukh', 'Gupta', 'Yadav', 'Joshi', 'Reddy', 'Nair', 'Chauhan', 'Mehta', 'Rao', 'Das'];
const CITIES = ['Delhi NCR', 'Bengaluru', 'Mumbai', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Chandigarh'];
const VEHICLES = ['EV Scooter', 'Motorcycle', 'Delivery Van', 'EV Auto', 'E-Bicycle'];
const PLATFORM_POOL = ['Swiggy', 'Zomato', 'Blinkit', 'Zepto', 'Uber India', 'Ola', 'Porter', 'Rapido', 'Urban Company', 'Shadowfax'];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateBigDriverDataset(count = 150) {
  const drivers = [];

  for (let i = 1; i <= count; i++) {
    const firstName = getRandomElement(FIRST_NAMES);
    const lastName = getRandomElement(LAST_NAMES);
    const fullName = `${firstName} ${lastName}`;
    const city = getRandomElement(CITIES);
    const vehicleType = getRandomElement(VEHICLES);
    
    // Assign 2 to 4 connected gig platforms per driver
    const platformCount = getRandomInt(2, 4);
    const shuffledPlatforms = [...PLATFORM_POOL].sort(() => 0.5 - Math.random());
    const selectedPlatforms = shuffledPlatforms.slice(0, platformCount);

    const connectedPlatforms = selectedPlatforms.map(pName => {
      const monthlyEarnings = getRandomInt(8500, 24500); // Realistic INR per platform
      const rating = parseFloat((Math.random() * (5.0 - 4.2) + 4.2).toFixed(2));
      const completedJobs = getRandomInt(180, 1450);
      const cancellationRate = parseFloat((Math.random() * (2.5 - 0.2) + 0.2).toFixed(1));

      return {
        platform: pName,
        monthlyEarnings,
        rating,
        completedJobs,
        cancellationRate,
      };
    });

    const totalMonthlyIncome = connectedPlatforms.reduce((sum, p) => sum + p.monthlyEarnings, 0);
    const accountAgeMonths = getRandomInt(4, 36);

    drivers.push({
      driverId: `DRV-IND-${1000 + i}`,
      name: fullName,
      email: `driver${i}@gigcredit.in`,
      phone: `+91 ${getRandomInt(90000, 99999)} ${getRandomInt(10000, 99999)}`,
      city,
      vehicleType,
      accountAgeMonths,
      bankName: getRandomElement(['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra']),
      bankAccountMasked: `****${getRandomInt(1000, 9999)}`,
      connectedPlatforms,
      totalMonthlyIncome,
      samplePayoutSms: `Alert: Your ${connectedPlatforms[0].platform} weekly payout of ₹${Math.round(connectedPlatforms[0].monthlyEarnings / 4)} was credited to Escrow HDFC0000240.`,
    });
  }

  return drivers;
}

module.exports = { generateBigDriverDataset };
