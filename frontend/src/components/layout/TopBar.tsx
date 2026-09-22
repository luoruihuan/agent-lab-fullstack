import React, { useState, useEffect } from 'react';
import { Input, Progress, Button, Dropdown, MenuProps, message } from 'antd';
import { SettingOutlined, LogoutOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import SettingsModal from '../settings/SettingsModal';

interface TopBarProps {
  completedCount: number;
  totalCount: number;
}

const TopBar: React.FC<TopBarProps> = ({ completedCount, totalCount }) => {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState<MenuProps['items']>([]);
  const [searchValue, setSearchValue] = useState('');

  const onLogout = async () => {
    try {
      await api.logout();
      navigate('/login');
    } catch (err) {
      message.error('退出失败');
    }
  };

  const handleSearch = async (val: string) => {
    setSearchValue(val);
    if (!val) {
      setSearchOptions([]);
      return;
    }
    try {
      const res = await api.search(val);
      const items = res.results.map((item: any) => ({
        key: item.id,
        label: `${item.chapterTitle} - ${item.title}`,
        onClick: () => {
          navigate(`/lesson/${item.id}`);
          setSearchOptions([]);
          setSearchValue('');
        }
      }));
      setSearchOptions(items);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1677ff' }}>Agent Lab</div>
      
      <div style={{ width: 300 }}>
        <Dropdown menu={{ items: searchOptions }} open={searchOptions && searchOptions.length > 0}>
          <Input 
            prefix={<SearchOutlined />} 
            placeholder="搜索知识点..." 
            value={searchValue}
            onChange={e => handleSearch(e.target.value)}
          />
        </Dropdown>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>进度 {completedCount}/{totalCount}</span>
          <Progress type="circle" percent={totalCount ? Math.round((completedCount / totalCount) * 100) : 0} size={32} />
        </div>
        <Button type="text" icon={<SettingOutlined />} onClick={() => setSettingsOpen(true)}>设置</Button>
        <Button type="text" icon={<LogoutOutlined />} onClick={onLogout}>退出</Button>
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default TopBar;
