import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { switchSite, switchClient } from '../../../redux/auth/authSlice';
import { RootState } from '../../../redux/store';

interface MenuItem {
  id: string;
  label: string;
}

interface UseSelectionProps {
  topLevelMenuItems: MenuItem[];
  SecondLevelMenuItems: MenuItem[];
}

export function useSelectuser({ topLevelMenuItems, SecondLevelMenuItems }: UseSelectionProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedsecondItemId, setSelectedsecondItemId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const usersite = useSelector((state: RootState) => state.auth.usersite);
  const userclient = useSelector((state: RootState) => state.auth.userclient);
  const dispatch = useDispatch();
useEffect(()=>{
    setSelectedCategoryId(usersite);
    setSelectedsecondItemId(userclient);
},[])
  const handleCategorySelect = (selectedCategory: MenuItem) => {
    setSelectedCategoryId(selectedCategory.id);
    dispatch(switchSite(selectedCategory.id));

    setIsModalOpen(true);
    
  };

  const handleopenModal = () => {

    setIsModalOpen(true);
    
  };
  const handlcloseModal = () => {

    setIsModalOpen(false);
    
  };
  const handleItemSelect = (selectedItem: MenuItem) => {
    setSelectedsecondItemId(selectedItem.id);

    if (selectedCategoryId !== null) {
      dispatch(switchClient(selectedItem.id));
    } 
  };

  return {
    selectedCategoryId,
    selectedsecondItemId,
    isModalOpen,
    usersite,
    userclient,
    handleCategorySelect,
    handleItemSelect,
    handleopenModal,
    handlcloseModal
  };
}
