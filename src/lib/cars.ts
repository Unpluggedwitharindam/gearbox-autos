import xuv from "@/assets/car-xuv500.jpg";
import creta from "@/assets/car-creta.jpg";
import fortuner from "@/assets/car-fortuner.jpg";
import dzire from "@/assets/car-dzire.jpg";
import verna from "@/assets/verna.png";

export type Car = {
  id: string;
  name: string;
  price: string;
  year: number;
  km: string;
  rto: string;
  location: string;
  fuel: string;
  transmission: string;
  image: string;
  features?: string[];
};

export const cars: Car[] = [
  { id: "xuv500", name: "Mahindra XUV500", price: "₹6,75,000", year: 2014, km: "36,000", rto: "JH05", location: "Jamshedpur", fuel: "Diesel", transmission: "Manual", image: xuv },
  { id: "creta", name: "Hyundai Creta 1.6 SX", price: "₹5,25,000", year: 2016, km: "48,500", rto: "JH05", location: "Jamshedpur", fuel: "Petrol", transmission: "Manual", image: creta },
  { id: "fortuner", name: "Toyota Fortuner 2.8 4x2 AT", price: "₹7,90,000", year: 2017, km: "62,000", rto: "JH05", location: "Jamshedpur", fuel: "Diesel", transmission: "Automatic", image: fortuner },
  { id: "dzire", name: "Maruti Suzuki Dzire VDI", price: "₹4,10,000", year: 2015, km: "42,000", rto: "JH05", location: "Jamshedpur", fuel: "Diesel", transmission: "Manual", image: dzire },
  { id: "verna", name: "Hyundai Verna 1.6 SX", price: "₹5,25,000", year: 2016, km: "48,500", rto: "JH05", location: "Jamshedpur", fuel: "Petrol", transmission: "Manual", image: verna,
    features: ["Touchscreen Infotainment", "Dual Airbags", "ABS with EBD", "Rear Parking Sensors", "Automatic Climate Control", "Alloy Wheels"] },
];
