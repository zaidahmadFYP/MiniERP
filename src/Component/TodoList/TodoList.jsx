import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Checkbox, Divider, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const TodoList = ({ userZone, userBranch }) => {
  const [tasks, setTasks] = useState([]);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  useEffect(() => {
    console.log('TodoList parameters:', { userZone, userBranch });
    
    if (!userZone || !userBranch) {
      console.error('Required parameters are missing:', {
        userZone,
        userBranch,
      });
      return;
    }

    // Fetch tasks from the backend based on user-specific zone and branch
    axios.get(`/api/user/assignedTasks`, {
      params: { zone: userZone, branch: userBranch }
    })
    .then(response => {
      setTasks(response.data);
      console.log('Tasks received:', response.data); // Debug line
    })
    .catch(error => console.error('Error fetching tasks:', error));
  }, [userZone, userBranch]);

  const handleMarkAll = async () => {
    try {
      await Promise.all(
        tasks.map((task) => 
          axios.patch(`/api/assignedTasks/${task._id}/complete`, { branch: userBranch })
        )
      );
      setTasks(tasks.map(task => ({ ...task, completed: true })));
    } catch (error) {
      console.error('Error marking all tasks as completed:', error);
    }
  };

  const handleToggle = async (taskId) => {
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    const updatedStatus = !task.completed;
    try {
      await axios.patch(`/api/assignedTasks/${taskId}/complete`, { branch: userBranch });
      setTasks(tasks.map(t =>
        t._id === taskId ? { ...t, completed: updatedStatus } : t
      ));
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const allCompleted = tasks.length > 0 && tasks.every(task => task.completed);

  return (
    <Box
      sx={{
        backgroundColor: isDarkMode ? '#333' : '#F9F9F9',
        padding: 1.5,
        borderRadius: 2,
        maxWidth: 400,
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto',
        '::-webkit-scrollbar': {
          width: '6px',
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
          borderRadius: '10px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#555',
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: isDarkMode ? '#333' : '#F9F9F9',
        },
      }}
    >
      {/* Header with "Mark All" checkbox */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, ml: 0.5 }}>
        <Checkbox
          checked={allCompleted}
          onChange={handleMarkAll}
          icon={<RadioButtonUncheckedIcon />}
          checkedIcon={<CheckCircleIcon />}
          sx={{ 
            color: '#f15a22',
            '&.Mui-checked': {
              color: '#f15a22',
            },
            padding: 0,
            marginRight: 1.5
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            fontFamily: 'Encode Sans',
            color: isDarkMode ? '#FFF' : 'inherit',
          }}
        >
          Mark All
        </Typography>
      </Box>

      {/* Divider */}
      <Divider sx={{ my: 1, bgcolor: isDarkMode ? '#555' : 'divider' }} />

      <Box
        sx={{
          maxHeight: 200,
          overflowY: 'auto',
          '::-webkit-scrollbar': {
            width: '6px',
          },
          '::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
            borderRadius: '10px',
          },
          '::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#555',
          },
          '::-webkit-scrollbar-track': {
            backgroundColor: isDarkMode ? '#333' : '#F9F9F9',
          },
        }}
      >
        <List disablePadding>
          {tasks.map((task) => (
            <ListItem
              key={task._id}
              secondaryAction={
                <Typography
                  variant="body2"
                  color={task.completed ? (isDarkMode ? '#333' : 'text.disabled') : (isDarkMode ? '#FFF' : 'text.secondary')}
                  sx={{ fontWeight: task.completed ? 'bold' : 'regular' }}
                >
                  {new Date(task.date).toLocaleDateString()}
                </Typography>
              }
              sx={{ paddingLeft: 2 }}
            >
              <ListItemIcon sx={{ minWidth: '25px' }}>
                <Checkbox
                  icon={<RadioButtonUncheckedIcon />}
                  checkedIcon={<CheckCircleIcon />}
                  edge="start"
                  checked={task.completed}
                  onChange={() => handleToggle(task._id)}
                  sx={{
                    color: task.completed ? (isDarkMode ? '#F5B300' : '#F5B300') : 'inherit',
                    '&.Mui-checked': {
                      color: '#f15a22',
                    },
                    padding: 0
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    sx={{
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? (isDarkMode ? '#888' : 'text.disabled') : (isDarkMode ? '#FFF' : 'text.primary'),
                    }}
                  >
                    {task.taskName}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default TodoList;
