import React, { useEffect, useState } from 'react';
import {
  Container, Paper, Typography, CircularProgress, Alert,
  Table, TableHead, TableRow, TableCell, TableBody, Button
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { progressService } from '../../api'; // ✅ using service layer

const ProgressApproval = () => {
  const { user } = useAuth();
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPendingProgress = async () => {
    setLoading(true);
    try {
      const res = await progressService.getPendingProgress(); // ✅ updated call
      setProgressList(res.data);
      setError('');
    } catch (err) {
      console.error('❌ Failed to fetch progress:', err);
      setError('Error fetching progress uploads');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await progressService.approveProgress(id); // ✅ updated call
      setSuccess('Progress approved successfully');
      fetchPendingProgress();
    } catch (err) {
      console.error('❌ Failed to approve progress:', err);
      setError('Error approving progress');
    }
  };

  useEffect(() => {
    fetchPendingProgress();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>📂 Admin: Progress Approval</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {loading ? (
          <CircularProgress />
        ) : progressList.length === 0 ? (
          <Typography>No pending progress uploads.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Engineer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {progressList.map((progress) => (
                <TableRow key={progress._id}>
                  <TableCell>{progress.engineerName || 'N/A'}</TableCell>
                  <TableCell>{new Date(progress.date).toLocaleDateString()}</TableCell>
                  <TableCell>{progress.location || 'Unknown'}</TableCell>
                  <TableCell>{progress.isApproved ? 'Approved' : 'Pending'}</TableCell>
                  <TableCell>
                    {!progress.isApproved && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleApprove(progress._id)}
                      >
                        Approve
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Container>
  );
};

export default ProgressApproval;
