<template>
    <div class="main">
        <Sidebar1 />
        <div class="dashboard">
            <h2>Slot Performance Dashboard</h2>
            <canvas id="scaleChart" aria-label="Scale Rating Chart" aria-describedby="scaleChartDesc"></canvas>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Sidebar1 from './sidenav1.vue';
import Chart  from 'chart.js/auto';  // Import Chart.js

export default {
    name: 'StudentDashboard',
    components: {
        Sidebar1
    },
    data() {
        return {
            scaleChart: null,
            feedbackData: []
        };
    },
    async created() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }
            const userResponse = await axios.get('http://127.0.0.1:3030/get-current-user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const userData = userResponse.data;
            const feedbackResponse = await axios.get('http://127.0.0.1:3030/slot-feedback', {
                params: {
                    rollno: userData.rollno
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            this.feedbackData = feedbackResponse.data;
        } catch (error) {
            console.error('Error fetching Informations:', error);
        }
    },
    methods: {
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
    },
    watch: {
        feedbackData(newData) {
            if (newData && newData.length > 0) {
                this.renderCharts();
            }
        }
    },
    mounted() {
        if (this.feedbackData.length > 0) {
            this.renderCharts();
        }
    }
};
</script>

<style scoped>
.dashboard {
    margin-top: 70px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    height: 500px;
    background-color: black;
    color: white;
    margin-left: 200px;
}
h2{
    margin-left: 400px;
    margin-bottom: 50px;
}

canvas {
    margin: 20px auto;
    max-width: 600px;
    height: 400px;
}
</style>
