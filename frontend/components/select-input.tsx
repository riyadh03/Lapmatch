import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type SelectOption = {
  label: string;
  value: string;
};

export function SelectInput({
  options,
  value,
  onValueChange,
  placeholder,
}: {
  options: SelectOption[];
  value: string | null;
  onValueChange: (value: string) => void;
  placeholder: string;
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value) ?? null,
    [options, value]
  );

  return (
    <>
      <TouchableOpacity style={styles.selectButton} onPress={() => setModalVisible(true)}>
        <Text style={[styles.selectText, !selectedOption && styles.placeholder]}>
          {selectedOption?.label ?? placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#9ca3af" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{placeholder}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.optionItem, item.value === value && styles.optionItemSelected]}
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}>
                  <Text style={[styles.optionText, item.value === value && styles.optionTextSelected]}>
                    {item.label}
                  </Text>
                  {item.value === value && <Ionicons name="checkmark" size={20} color="#4f46e5" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  selectText: {
    fontSize: 16,
    color: '#fff',
  },
  placeholder: {
    color: '#6b7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2d3748',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
  },
  optionItemSelected: {
    backgroundColor: '#4f46e520',
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
  },
  optionTextSelected: {
    color: '#4f46e5',
    fontWeight: '600',
  },
});
