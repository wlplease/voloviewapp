import React, { useState, useEffect } from 'react';

const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
  { code: 'CAD', symbol: 'C$' },
];

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#FFD93D'];

const styles = {
  container: { 
    fontFamily: 'Arial, sans-serif', 
    maxWidth: '800px', 
    margin: '0 auto', 
    padding: '20px', 
    backgroundColor: '#92EAEB', 
    color: '#000000', 
    fontWeight: 'bold' 
  },
  header: { 
    backgroundColor: '#FFADDE', 
    padding: '10px', 
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: '10px',
  },
  nav: { 
    display: 'flex', 
    justifyContent: 'center',
    width: '100%',
  },
  button: { 
    padding: '10px', 
    margin: '5px', 
    backgroundColor: '#FFADDE', 
    color: '#000000', 
    border: 'none', 
    cursor: 'pointer', 
    fontWeight: 'bold' 
  },
  input: { 
    width: '100%', 
    padding: '10px', 
    margin: '5px 0', 
    backgroundColor: '#FFFFFF', 
    color: '#000000', 
    fontWeight: 'bold' 
  },
  select: { 
    width: '100%', 
    padding: '10px', 
    margin: '5px 0', 
    backgroundColor: '#FFFFFF', 
    color: '#000000', 
    fontWeight: 'bold' 
  },
  footer: { 
    backgroundColor: '#FFADDE', 
    padding: '10px', 
    marginTop: '20px', 
    textAlign: 'center', 
    color: '#000000', 
    fontWeight: 'bold' 
  },
  card: { 
    border: '1px solid #FFADDE', 
    borderRadius: '4px', 
    padding: '10px', 
    marginBottom: '10px', 
    backgroundColor: '#FFFFFF', 
    color: '#000000' 
  },
  label: { 
    display: 'block', 
    marginBottom: '5px', 
    fontWeight: 'bold', 
    color: '#000000' 
  },
  pieChart: { 
    width: '200px', 
    height: '200px', 
    borderRadius: '50%', 
    margin: '20px auto' 
  },
  legendItem: { 
    display: 'flex', 
    alignItems: 'center', 
    margin: '5px 0' 
  },
  legendColor: { 
    width: '20px', 
    height: '20px', 
    marginRight: '10px' 
  },
  summary: {
    textAlign: 'left',
    padding: '20px',
    marginTop: '20px',
    border: '1px solid #FFADDE',
    backgroundColor: '#F0F0F0',
  },
};

const Header = ({ onNavigate }) => (
  <header style={styles.header}>
    <div style={styles.headerTitle}>SplitSmart by Voloview</div>
    <nav style={styles.nav}>
      {['Home', 'About', 'Privacy', 'Terms'].map(item => (
        <button key={item} style={styles.button} onClick={() => onNavigate(item.toLowerCase())}>
          {item}
        </button>
      ))}
    </nav>
  </header>
);

const Footer = () => (
  <footer style={styles.footer}>
    <p>© 2024 Pelican Pointe LLC. All rights reserved.</p>
  </footer>
);

const BillInput = ({ totalBill, setTotalBill, currency, setCurrency }) => {
  return (
    <div style={styles.card}>
      <label style={styles.label}>Total Bill:</label>
      <input
        type="number"
        value={totalBill}
        onChange={(e) => setTotalBill(Number(e.target.value))}
        style={styles.input}
      />
      <label style={styles.label}>Currency:</label>
      <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={styles.select}>
        {CURRENCIES.map((curr) => (
          <option key={curr.code} value={curr.code}>{curr.code} ({curr.symbol})</option>
        ))}
      </select>
    </div>
  );
};

const PeopleManager = ({ numPeople, setNumPeople, names, setNames, exemptPerson, setExemptPerson, shares, setShares }) => {
  const randomizeExempt = () => {
    const randomIndex = Math.floor(Math.random() * numPeople);
    setExemptPerson(randomIndex);
  };

  const handleShareChange = (index, value) => {
    const updatedShares = [...shares];
    updatedShares[index] = Number(value);
    setShares(updatedShares);
  };

  return (
    <div style={styles.card}>
      <label style={styles.label}>Number of People:</label>
      <input
        type="number"
        value={numPeople}
        onChange={(e) => setNumPeople(Number(e.target.value))}
        style={styles.input}
      />
      {names.map((name, index) => (
        <div key={index}>
          <label style={styles.label}>
            {name}{exemptPerson === index ? ' (Exempt)' : ''}:
          </label>
          <input
            value={name}
            onChange={(e) => {
              const newNames = [...names];
              newNames[index] = e.target.value;
              setNames(newNames);
            }}
            style={styles.input}
          />
          <label style={styles.label}>Share %:</label>
          <input
            type="number"
            value={shares[index] || 0}
            onChange={(e) => handleShareChange(index, e.target.value)}
            style={styles.input}
          />
        </div>
      ))}
      <button onClick={randomizeExempt} style={styles.button}>Randomize Exempt Person</button>
    </div>
  );
};

const SplitCalculator = ({ totalBill, numPeople, tipPercentage, currency, exemptPerson, names, shares }) => {
  const getCurrencySymbol = (code) => CURRENCIES.find(c => c.code === code)?.symbol || code;

  const calculateSplit = () => {
    const tipAmount = totalBill * (tipPercentage / 100);
    const totalAmount = totalBill + tipAmount;

    const totalShares = shares.reduce((acc, share, index) => {
      return exemptPerson !== index ? acc + share : acc;
    }, 0);

    const perPersonAmounts = shares.map((share, index) => {
      if (exemptPerson === index) return 0;
      return ((totalAmount * share) / totalShares).toFixed(2);
    });

    return perPersonAmounts;
  };

  const renderPieChart = () => {
    const anglePerPerson = 360 / (numPeople - (exemptPerson !== null ? 1 : 0));
    const background = names.map((_, index) => {
      if (index === exemptPerson) return '';
      const startAngle = index * anglePerPerson;
      const endAngle = (index + 1) * anglePerPerson;
      return `${COLORS[index % COLORS.length]} ${startAngle}deg ${endAngle}deg`;
    }).join(', ');

    return (
      <div>
        <div style={{...styles.pieChart, background: `conic-gradient(${background})`}}></div>
        <div>
          {names.map((name, index) => (
            <div key={index} style={styles.legendItem}>
              <div style={{...styles.legendColor, backgroundColor: COLORS[index % COLORS.length]}}></div>
              <span>{name}{exemptPerson === index ? ' (Exempt)' : ''}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const perPersonAmounts = calculateSplit();

  return (
    <div style={styles.card}>
      <h3>Split Summary</h3>
      <div style={styles.summary}>
        <p>Total Bill: {getCurrencySymbol(currency)}{totalBill.toFixed(2)}</p>
        <p>Tip Percentage: {tipPercentage}%</p>
        <p>Tip Amount: {getCurrencySymbol(currency)}{(totalBill * (tipPercentage / 100)).toFixed(2)}</p>
        <p>Total Amount: {getCurrencySymbol(currency)}{(totalBill + totalBill * (tipPercentage / 100)).toFixed(2)}</p>
        {names.map((name, index) => (
          <p key={index}>
            {name}{exemptPerson === index ? ' (Exempt)' : ''}: {getCurrencySymbol(currency)}{perPersonAmounts[index]}
          </p>
        ))}
      </div>
      {renderPieChart()}
    </div>
  );
};

const SplitSmart = () => {
  const [totalBill, setTotalBill] = useState(100);
  const [numPeople, setNumPeople] = useState(2);
  const [names, setNames] = useState(['Person 1', 'Person 2']);
  const [tipPercentage, setTipPercentage] = useState(15);
  const [currency, setCurrency] = useState('USD');
  const [exemptPerson, setExemptPerson] = useState(null);
  const [shares, setShares] = useState([50, 50]); // Initial shares, assuming even split

  useEffect(() => {
    setNames(prevNames => {
      const newNames = [...prevNames];
      while (newNames.length < numPeople) {
        newNames.push(`Person ${newNames.length + 1}`);
      }
      return newNames.slice(0, numPeople);
    });

    setShares(prevShares => {
      const newShares = [...prevShares];
      while (newShares.length < numPeople) {
        newShares.push(100 / numPeople); // Default to even split for new people
      }
      return newShares.slice(0, numPeople);
    });
  }, [numPeople]);

  return (
    <div>
      <BillInput totalBill={totalBill} setTotalBill={setTotalBill} currency={currency} setCurrency={setCurrency} />
      <PeopleManager 
        numPeople={numPeople} 
        setNumPeople={setNumPeople} 
        names={names} 
        setNames={setNames}
        exemptPerson={exemptPerson}
        setExemptPerson={setExemptPerson}
        shares={shares}
        setShares={setShares}
      />
      <div style={styles.card}>
        <label style={styles.label}>Tip Percentage:</label>
        <input
          type="number"
          value={tipPercentage}
          onChange={(e) => setTipPercentage(Number(e.target.value))}
          style={styles.input}
        />
      </div>
      <SplitCalculator 
        totalBill={totalBill} 
        numPeople={numPeople} 
        tipPercentage={tipPercentage} 
        currency={currency}
        exemptPerson={exemptPerson}
        names={names}
        shares={shares}
      />
    </div>
  );
};

const AboutPage = () => (
  <div style={styles.card}>
    <h2>About SplitSmart</h2>
    <p>SplitSmart is an innovative bill-splitting application designed to simplify the process of dividing expenses among friends, family, or colleagues.</p>
    <h3>Contact Information:</h3>
    <p>Email: info@voloview.com</p>
    <p>Phone: 321-405-3122</p>
    <p>Address: 5000 W Midway Rd 13593, Ft. Pierce, FL 34979</p>
  </div>
);

const PrivacyPolicy = () => (
  <div style={styles.card}>
    <h2>Privacy Policy</h2>
    <p>We respect your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our service.</p>

    <h3>1. Information We Collect</h3>
    <p>When you use SplitSmart, we may collect the following types of information:</p>
    <ul>
      <li><strong>Personal Information:</strong> This may include your name, email address, and phone number when you sign up for our service or contact us.</li>
      <li><strong>Usage Data:</strong> We collect data on how you interact with our service, including pages visited, features used, and the time spent on each page.</li>
      <li><strong>Cookies and Tracking Technologies:</strong> We use cookies to enhance your experience, track your usage patterns, and remember your preferences.</li>
    </ul>

    <h3>2. How We Use Your Information</h3>
    <p>The information we collect is used for the following purposes:</p>
    <ul>
      <li><strong>To Provide and Improve Our Service:</strong> We use your information to deliver the services you request, process transactions, and improve the functionality of our platform.</li>
      <li><strong>To Communicate With You:</strong> We may use your contact information to send you updates, newsletters, or respond to your inquiries.</li>
      <li><strong>To Analyze and Optimize:</strong> We use aggregated data to understand user behavior and improve our service. This data is also used to personalize your experience.</li>
    </ul>

    <h3>3. Sharing Your Information</h3>
    <p>We do not sell, trade, or rent your personal information to others. We may share your information with third-party service providers who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.</p>

    <h3>4. Data Security</h3>
    <p>We take the security of your personal information seriously. We implement various security measures to maintain the safety of your data, including encryption and secure servers. However, no method of transmission over the internet is completely secure, so we cannot guarantee absolute security.</p>

    <h3>5. Your Rights</h3>
    <p>You have the right to access, correct, or delete your personal information at any time. If you wish to exercise these rights, please contact us at <a href="mailto:info@voloview.com">info@voloview.com</a>.</p>

    <h3>6. Changes to This Privacy Policy</h3>
    <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page. You are encouraged to review this Privacy Policy periodically to stay informed about how we are protecting your information.</p>

    <h3>7. Contact Us</h3>
    <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
    <ul>
      <li>Email: <a href="mailto:info@voloview.com">info@voloview.com</a></li>
      <li>Phone: 321-405-3122</li>
      <li>Address: 5000 W Midway Rd 13593, Ft. Pierce, FL 34979</li>
    </ul>
  </div>
);


const TermsOfService = () => (
  <div style={styles.card}>
    <h2>Terms of Service</h2>
    <p>By using SplitSmart, you agree to abide by our terms of service. Please read these terms carefully before using our platform.</p>

    <h3>1. Acceptance of Terms</h3>
    <p>By accessing or using SplitSmart, you agree to be bound by these Terms of Service, all applicable laws, and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>

    <h3>2. Use of the Service</h3>
    <p>You agree to use SplitSmart solely for lawful purposes. You are prohibited from using the service to engage in any illegal activity or conduct that violates the rights of others.</p>

    <h3>3. User Accounts</h3>
    <p>To use certain features of SplitSmart, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.</p>

    <h3>4. Intellectual Property</h3>
    <p>All content, features, and functionality available on SplitSmart, including but not limited to text, graphics, logos, and software, are the property of Pelican Pointe LLC or its licensors and are protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works of any content without our express written permission.</p>

    <h3>5. Limitation of Liability</h3>
    <p>SplitSmart is provided on an "as-is" and "as-available" basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
    <p>In no event shall Pelican Pointe LLC or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SplitSmart's website, even if Pelican Pointe LLC or a Pelican Pointe LLC authorized representative has been notified orally or in writing of the possibility of such damage.</p>

    <h3>6. Indemnification</h3>
    <p>You agree to indemnify, defend, and hold harmless Pelican Pointe LLC, its affiliates, and their respective officers, directors, employees, and agents from and against any and all claims, damages, liabilities, costs, and expenses, including legal fees, arising from your use of the service or your breach of these Terms of Service.</p>

    <h3>7. Termination</h3>
    <p>We reserve the right to terminate or suspend your account and access to SplitSmart at our sole discretion, without notice or liability, for any reason, including if you breach these Terms of Service.</p>

    <h3>8. Governing Law</h3>
    <p>These terms are governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict of law provisions. You agree to submit to the personal jurisdiction of the state and federal courts located in Florida for the resolution of any disputes arising out of or relating to these Terms of Service or your use of SplitSmart.</p>

    <h3>9. Changes to Terms of Service</h3>
    <p>We may revise these Terms of Service at any time without notice. By using SplitSmart, you are agreeing to be bound by the then-current version of these Terms of Service. It is your responsibility to review these terms periodically for any changes.</p>

    <h3>10. Contact Information</h3>
    <p>If you have any questions or concerns about these Terms of Service, please contact us at:</p>
    <ul>
      <li>Email: <a href="mailto:info@voloview.com">info@voloview.com</a></li>
      <li>Phone: 321-405-3122</li>
      <li>Address: 5000 W Midway Rd 13593, Ft. Pierce, FL 34979</li>
    </ul>
  </div>
);


const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <AboutPage />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsOfService />;
      default:
        return <SplitSmart />;
    }
  };

  return (
    <div style={styles.container}>
      <Header onNavigate={setCurrentPage} />
      {renderPage()}
      <Footer />
    </div>
  );
};

export default App;
