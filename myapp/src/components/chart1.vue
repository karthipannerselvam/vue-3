<template>
    <div class="main">
        <Sidebar />
        <div class="dashboard">
            <h2>Slot Performance Dashboard</h2>

            <div class="form-container">
                <label for="studentRollno">Enter Student's Rollno:</label>
                <input v-model="studentRollno" type="text" id="studentRollno" placeholder="Enter student rollno" />
                <button @click="fetchStudentData">Submit</button>
            </div>

            <!-- Only show the chart if feedbackData is available -->
        </div>
        <div v-if="feedbackData.length > 0">
            <canvas id="scaleChart" aria-label="Scale Rating Chart" aria-describedby="scaleChartDesc"></canvas>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Sidebar from './sidenav.vue';
import Chart from 'chart.js/auto';  // Import Chart.js

export default {
    name: 'StudentDashboard',
    components: {
        Sidebar
    },
    data() {
        return {
            scaleChart: null,
            feedbackData: [],
            studentRollno: '', // Bind input to this variable
        };
    },
    methods: {
        async fetchStudentData() {
            const adminToken = localStorage.getItem('adminToken');
        
            if (!adminToken) {
                alert('Admin not authenticated. Please log in again.');
                return;
            }
          
            if (!this.studentRollno) {
                alert("Please enter a student's rollno");
                return;
            }

            try {
                // Fetch the feedback data for the given student rollno
                const feedbackResponse = await axios.get('http://127.0.0.1:3030/slot-feedback', {
                    params: {
                        rollno: this.studentRollno
                    },
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                    }
                });

                this.feedbackData = feedbackResponse.data;

                if (this.feedbackData.length > 0) {
                    this.renderCharts();
                } else {
                    alert("No feedback data found for this rollno.");
                }

            } catch (error) {
                console.error('Error fetching feedback data:', error);
            }
        },
        renderCharts() {
            const canvas = document.getElementById('scaleChart');
            if (canvas) {
                const ctx = canvas.getContext('2d');

                // Clear the previous chart content
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // If a previous chart exists, destroy it
                if (this.scaleChart) {
                    this.scaleChart.destroy();
                }

                // Create a new chart instance
                this.scaleChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: this.feedbackData.map(f => f.eventName),
                        datasets: [{
                            label: 'Scale Rating (1-5)',
                            data: this.feedbackData.map(f => f.scale),
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            borderRadius: 5,
                        }],
                    },
                    options: {
                        layout: {
                            padding: {
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 5,
                            },
                        },
                        plugins: {
                            tooltip: {
                                enabled: true,
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                titleColor: '#fff',
                                bodyColor: '#fff',
                                borderWidth: 1,
                                borderColor: '#fff',
                                displayColors: false,
                                callbacks: {
                                    label: (tooltipItem) => {
                                        const dataIndex = tooltipItem.dataIndex;
                                        const dataPoint = this.feedbackData[dataIndex];
                                        const formattedDate = new Date(dataPoint.date).toISOString().split('T')[0];
                                        return [
                                            `Rating: ${tooltipItem.raw}`,
                                            `Remark: ${dataPoint.remarks}`,
                                            `Date: ${formattedDate}`,
                                            `Venue: ${dataPoint.venue}`,
                                        ];
                                    },
                                    title: (tooltipItems) => {
                                        const item = tooltipItems[0];
                                        return `Event: ${item.label}`;
                                    }
                                }
                            }
                        },
                    },
                });
            }
        }
    }
};
</script>

<style scoped>
.main{
    display: flex;
    flex-direction: column
}
.dashboard {
    margin-top: 70px;
    padding: 20px;
    border-radius: 8px;
    height: auto;
    width: fit-content;
    color: #3e3e3e;
    margin-left: 200px;
}
input{
    color: #3e3e3e;
}
h2 {
    margin-left: 400px;
    margin-bottom: 50px;
}

canvas {
    margin: 20px auto;
    max-width: 600px;
    height: 400px;
    margin-left: 400px;
}

.form-container {
    margin-left: 400px;
    margin-bottom: 20px;
}

input[type="text"] {
    padding: 10px;
    width: 300px;
    border: 1px solid #ccc;
    border-radius: 4px;
    color: black; /* Adjusted text color for better visibility */
    margin-right: 10px;
}

button {
    padding: 10px 20px;
    background-color: #474554;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #313039;
}
</style>
