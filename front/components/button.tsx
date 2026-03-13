import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  variante?: 'primaire' | 'secondaire';
};

export default function Button({
  label,
  onPress,
  variante = 'primaire',
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.bouton, variante === 'secondaire' && styles.boutonSecondaire]}
      onPress={onPress}
    >
      <Text style={[styles.texte, variante === 'secondaire' && styles.texteSecondaire]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bouton: {
    backgroundColor: '#4A90E2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  boutonSecondaire: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  texte: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  texteSecondaire: {
    color: '#4A90E2',
  },
});