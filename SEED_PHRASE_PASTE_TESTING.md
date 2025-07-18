# 📋 Seed Phrase Paste Functionality - Testing Guide

## 🎯 New Feature Added

**Auto-fill seed phrase from paste**: Users can now paste their complete 12-word seed phrase into any input box and it will automatically distribute the words across all 12 fields.

## 🧪 How to Test

### Test Seed Phrase:
```
chair age vessel narrow wave help pattern try equip tell scheme blue
```

### Testing Steps:

#### 1. **Unlock Multi-Signature Settings**
- Navigate to `/multisign-settings`
- Lock your settings first (if not already locked)
- Click "Unlock to Modify" button
- In the unlock dialog:

#### 2. **Test Paste Functionality**
- Click in **any** of the 12 word input boxes
- Paste the complete seed phrase: `chair age vessel narrow wave help pattern try equip tell scheme blue`
- **Expected Result**: All 12 boxes should automatically fill with the individual words

#### 3. **Test Disable Multi-Signature**
- Try to disable multi-signature (requires seed phrase)
- In the disable dialog:
- Paste the same seed phrase in any box
- **Expected Result**: All 12 boxes fill automatically

## 🔧 Technical Implementation

### What happens when user pastes:

1. **Detects multiple words**: Checks if pasted text contains spaces
2. **Counts words**: Splits by whitespace and counts
3. **Auto-distributes**: 
   - If exactly 12 words → fills all boxes
   - If multiple words but not 12 → fills from current position
   - If single word → normal behavior

### Code Logic:
```javascript
const words = value.trim().split(/\s+/);
if (words.length === 12) {
  // Fill all 12 boxes
  setSeedPhrase(words);
} else if (words.length > 1) {
  // Fill from current position
  const updated = [...seedPhrase];
  for (let i = 0; i < words.length && (idx + i) < 12; i++) {
    updated[idx + i] = words[i];
  }
  setSeedPhrase(updated);
}
```

## 🎯 User Experience Improvements

### Before:
- Users had to manually type each word in individual boxes
- Tedious and error-prone
- Copy-paste from password managers didn't work

### After:
- ✅ Paste complete seed phrase anywhere
- ✅ Automatic word distribution
- ✅ Clear visual feedback
- ✅ Helpful tip shown in dialog
- ✅ Works in both unlock and disable dialogs

## 💡 UI Enhancements Added

### New Help Text:
- Added blue info box with tip: *"You can paste your complete 12-word seed phrase into any box and it will automatically fill all fields"*
- Appears in both unlock and disable dialogs
- Makes the feature discoverable

### Dialog Structure:
1. **Main instruction** (existing)
2. **💡 Tip box** (new) - explains paste functionality
3. **⚠️ Warning box** (existing) - security notice
4. **12 input boxes** (enhanced with paste detection)

## 🧪 Edge Cases Handled

### Scenario 1: Exact 12 words
```
Input: "chair age vessel narrow wave help pattern try equip tell scheme blue"
Result: Perfect distribution across all 12 boxes
```

### Scenario 2: Extra spaces
```
Input: "  chair   age  vessel narrow   wave help  "
Result: Properly trimmed and distributed
```

### Scenario 3: Less than 12 words
```
Input: "chair age vessel narrow" (pasted in box 3)
Result: Fills boxes 3, 4, 5, 6
```

### Scenario 4: More than 12 words
```
Input: "chair age vessel narrow wave help pattern try equip tell scheme blue extra word"
Result: Takes first 12 words, ignores extras
```

## 🎯 Testing Checklist

- [ ] Paste 12 words in first box → all boxes fill
- [ ] Paste 12 words in middle box → all boxes fill (overwrites existing)
- [ ] Paste 4 words in box 3 → boxes 3-6 fill
- [ ] Paste single word → normal single-word behavior
- [ ] Paste with extra spaces → properly trimmed
- [ ] Works in unlock dialog
- [ ] Works in disable dialog
- [ ] Help tip is visible and clear
- [ ] Error messages clear when successful paste

---

**Ready to test!** Navigate to your multi-signature settings and try pasting: `chair age vessel narrow wave help pattern try equip tell scheme blue`
