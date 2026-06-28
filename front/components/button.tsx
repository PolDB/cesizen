import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../constants/colors';

type Variant = 'primary' | 'secondary' | 'danger';
interface Props { label: string; onPress: () => void; variant?: Variant; style?: ViewStyle; }

export default function Button({ label, onPress, variant = 'primary', style }: Props) {
  return (
    <TouchableOpacity 
      style={[styles.base, styles[variant], style]} 
      onPress={onPress} 
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={label}>
        <Text style={[styles.text, styles[`${variant}Text` as keyof typeof styles]]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 12, padding: 14, alignItems: 'center' },
  primary: { backgroundColor: COLORS.violet },
  secondary: { borderWidth: 1.5, borderColor: COLORS.violet, backgroundColor: 'transparent' },
  danger: { borderWidth: 1.5, borderColor: '#e74c3c', backgroundColor: 'transparent' },
  text: { fontWeight: '600', fontSize: 15 },
  primaryText: { color: COLORS.blanc },
  secondaryText: { color: COLORS.violet },
  dangerText: { color: '#e74c3c' },
});