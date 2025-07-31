# Frontend Folder Structure

## Current Organized Structure

```
src/
├── _backup/                    # Backup files (old App versions, test files)
├── assets/                     # Static assets (images, icons)
├── component/                  # Reusable components
│   ├── auth/                   # Authentication components
│   ├── BecomeOwnerModal/       # Become owner modal
│   ├── footer/                 # Footer components
│   ├── HomePage/               # Homepage components
│   ├── LoginModal/             # Login modal
│   ├── maps/                   # Google Maps components
│   │   ├── GoogleMapsPicker.jsx
│   │   └── index.js
│   ├── nav/                    # Navigation components
│   ├── Owner/                  # Owner-specific components
│   ├── payment/                # Payment-related components
│   │   ├── ABAPayModal.jsx
│   │   ├── ABAPayModal.css
│   │   └── index.js
│   ├── SearchPage/             # Search page components
│   ├── SignupModal/            # Signup modal
│   ├── wallet/                 # Wallet-related components
│   │   ├── WalletBalance.jsx
│   │   ├── WalletBalance.css
│   │   ├── WalletStats.jsx
│   │   ├── WalletStats.css
│   │   ├── TransactionHistory.jsx
│   │   ├── TransactionHistory.css
│   │   ├── WithdrawModal.jsx
│   │   ├── WithdrawModal.css
│   │   └── index.js
│   ├── EnvironmentDebugger.jsx
│   └── index.js               # Main component exports
├── config/                     # Configuration files
│   ├── api.js
│   └── config.js
├── context/                    # React context providers
│   └── AuthContext.js
├── page/                       # Page components
│   ├── About/
│   ├── AdminBooking/
│   ├── Auth/
│   ├── Booking/
│   ├── BookingDetails/
│   ├── BookingHistory/
│   ├── Dashboard/
│   ├── Favorites/
│   ├── Homepage/
│   ├── Listing/
│   ├── Message/
│   ├── OwnerSetting/
│   ├── Profile/
│   ├── RoomDetails/
│   ├── VenueSearch/
│   ├── VenuesList/
│   └── Wallet/
├── services/                   # API and service functions
│   ├── api.js
│   ├── emailService.js
│   └── walletService.js
├── App.js                      # Main App component
├── App.css                     # App styles
├── index.js                    # Entry point
├── index.css                   # Global styles
└── logo.svg                    # React logo
```

## Import Examples

### Before (scattered imports):
```javascript
import WalletBalance from '../components/WalletBalance';
import TransactionHistory from '../components/TransactionHistory';
import ABAPayModal from '../component/ABAPayModal';
```

### After (organized imports):
```javascript
import { WalletBalance, TransactionHistory } from '../component/wallet';
import { ABAPayModal } from '../component/payment';
```

## Benefits of This Structure

1. **Logical Grouping**: Related components are grouped together
2. **Easy Navigation**: Clear folder names indicate purpose
3. **Scalable**: Easy to add new components to appropriate folders
4. **Clean Imports**: Index files allow for cleaner import statements
5. **Maintainable**: Backup files are separate from active code
6. **Consistent**: All folders follow same naming convention

## Folder Naming Convention

- **component/**: Reusable UI components
- **page/**: Full page components/routes
- **services/**: API calls and business logic
- **context/**: React context providers
- **config/**: Configuration files
- **assets/**: Static files (images, fonts, etc.)
- **_backup/**: Backup and test files (excluded from production)
