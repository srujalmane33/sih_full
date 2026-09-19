// Lightweight zone state slice (used by context internally)
export const initialZoneState = {
  zones: [],
  selectedZoneId: null,
  riskFilter: 'ALL',
  searchQuery: '',
};

export function zoneReducer(state, action) {
  switch (action.type) {
    case 'SET_ZONES':
      return { ...state, zones: action.payload };
    case 'SELECT_ZONE':
      return { ...state, selectedZoneId: state.selectedZoneId === action.payload ? null : action.payload };
    case 'SET_RISK_FILTER':
      return { ...state, riskFilter: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
}
