# Translation Issue: "homestead" Not Saved

## Issue Summary
A translation entry with English source word "homestead" was created in the UI but not saved to the database.

## Root Cause
**Authentication Required** - The `/api/translations` POST endpoint requires authentication.

## What's Working ✅
- ✅ Translation API (`/api/translate`) works correctly
- ✅ LibreTranslate service is running and translating
- ✅ Translations returned successfully:
  - German: "heimstätte"
  - French: "maison"  
  - Italian: "homestead" (untranslated - LibreTranslate limitation)
  - Spanish: "hogar"

## What's Not Working ❌
- ❌ Translation entry not saved to database
- ❌ API returns `{"error":"Authentication required"}` for POST to `/api/translations`

## Logs Analysis

```
2026-02-13T14:10:02.349Z INFO  [API] ========== REQUEST ==========
2026-02-13T14:10:02.350Z INFO  [API] Text: "homestead"
2026-02-13T14:10:02.350Z INFO  [API] Source language: en
2026-02-13T14:10:05.087Z INFO  [API] ========== RESPONSE ==========
2026-02-13T14:10:05.087Z INFO  [API] german: "heimstätte" (10 alternatives)
2026-02-13T14:10:05.087Z INFO  [API] french: "maison" (8 alternatives)
2026-02-13T14:10:05.087Z INFO  [API] italian: "homestead" (9 alternatives)
2026-02-13T14:10:05.087Z INFO  [API] spanish: "hogar" (10 alternatives)
```

**No database INSERT/UPDATE operations logged** - confirms translation was never saved.

## Solution

### For Web App Users:
1. Make sure you're **logged in** before creating translations
2. Check browser console for authentication errors
3. Verify you have a valid session token

### For iOS App (MultiLinguaIOS):
The iOS app currently has **TODO placeholders** for API calls:

```swift
// LoginView.swift line 104-110
private func handleSubmit() async {
    // TODO: Call API to send login code
    // TODO: Call API to verify code and login
    appState.isAuthenticated = true  // ⚠️ Fake auth
}
```

**Action needed:**
1. Implement real API client in `MultiLinguaIOS/API/`
2. Add authentication token storage in Keychain
3. Include `Authorization: Bearer <token>` header in all API requests
4. Handle 401 Unauthorized responses

### Testing Authentication Flow:

```bash
# 1. Register user
curl -X POST http://localhost:3456/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","fullName":"Test User"}'

# Check logs for code: 📧 [DEV MODE] ... code: XXXXXX

# 2. Verify registration
curl -X POST http://localhost:3456/api/auth/verify-registration \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"XXXXXX"}'

# Returns: {"token":"...","user":{...}}

# 3. Create translation WITH TOKEN
curl -X POST http://localhost:3456/api/translations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token-from-step-2>" \
  -d '{"english":"homestead","german":"heimstätte","french":"maison","italian":"homestead","spanish":"hogar"}'
```

## Next Steps

**For MultiLinguaIOS:**
1. Create `APIClient.swift` with authentication support
2. Create `KeychainManager.swift` for secure token storage
3. Update `LoginView.swift` and `RegisterView.swift` to call real APIs
4. Update `TranslationsView.swift` to save translations via authenticated API
5. Add token refresh logic

**For Web App:**
- Verify the login flow is working correctly in the browser
- Check if session cookies are being set properly
- Ensure middleware is attaching auth context to requests

---

**Status:** Translation API works, but database save fails due to missing authentication.
