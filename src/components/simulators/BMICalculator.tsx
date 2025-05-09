
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from 'lucide-react';

interface BMICategory {
  name: string;
  range: string;
  description: string;
  color: string;
}

const BMICategories: BMICategory[] = [
  { 
    name: "Underweight", 
    range: "Below 18.5", 
    description: "May indicate nutritional deficiency or other health issues.",
    color: "#64B5F6" // Light primary
  },
  { 
    name: "Normal weight", 
    range: "18.5 - 24.9", 
    description: "Associated with good health outcomes.",
    color: "#4CAF50" // Secondary
  },
  { 
    name: "Overweight", 
    range: "25 - 29.9", 
    description: "May increase risk for certain health conditions.",
    color: "#FF9800" // Warning
  },
  { 
    name: "Obesity", 
    range: "30 or higher", 
    description: "Associated with higher risk for many health conditions.",
    color: "#F44336" // Destructive
  }
];

export default function BMICalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [measureSystem, setMeasureSystem] = useState("metric");
  const [bmi, setBMI] = useState<number | null>(null);
  const [animateValue, setAnimateValue] = useState(0);
  const [category, setCategory] = useState<BMICategory | null>(null);

  // Convert height based on measurement system
  const getHeightInMeters = () => {
    if (measureSystem === "metric") {
      return parseFloat(height) / 100; // cm to m
    } else {
      // Imperial: height in inches to meters
      return parseFloat(height) * 0.0254;
    }
  };

  // Convert weight based on measurement system
  const getWeightInKg = () => {
    if (measureSystem === "metric") {
      return parseFloat(weight); // already in kg
    } else {
      // Imperial: weight in pounds to kg
      return parseFloat(weight) * 0.453592;
    }
  };

  const calculateBMI = () => {
    try {
      const heightInM = getHeightInMeters();
      const weightInKg = getWeightInKg();
      
      if (isNaN(heightInM) || isNaN(weightInKg) || heightInM <= 0 || weightInKg <= 0) {
        throw new Error("Please enter valid height and weight values");
      }
      
      // BMI formula: weight (kg) / [height (m)]²
      const calculatedBMI = weightInKg / (heightInM * heightInM);
      setBMI(parseFloat(calculatedBMI.toFixed(1)));
      
      // Animate the progress bar
      setAnimateValue(0);
      setTimeout(() => {
        setAnimateValue(Math.min(calculatedBMI, 40) * 2.5); // Scale to fit in progress bar
      }, 100);
      
      // Determine BMI category
      if (calculatedBMI < 18.5) {
        setCategory(BMICategories[0]);
      } else if (calculatedBMI < 25) {
        setCategory(BMICategories[1]);
      } else if (calculatedBMI < 30) {
        setCategory(BMICategories[2]);
      } else {
        setCategory(BMICategories[3]);
      }
    } catch (error) {
      console.error(error);
      alert("Please enter valid height and weight values");
    }
  };

  const resetCalculator = () => {
    setHeight("");
    setWeight("");
    setBMI(null);
    setAnimateValue(0);
    setCategory(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-primary/5 rounded-t-lg">
        <CardTitle className="text-2xl font-semibold text-primary">BMI Health Calculator</CardTitle>
        <CardDescription>Check your Body Mass Index (BMI) in seconds</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="measureSystem">Measurement System</Label>
            </div>
            <RadioGroup 
              value={measureSystem} 
              onValueChange={setMeasureSystem}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="metric" id="metric" />
                <Label htmlFor="metric" className="cursor-pointer">Metric (cm, kg)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="imperial" id="imperial" />
                <Label htmlFor="imperial" className="cursor-pointer">Imperial (in, lbs)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="height" className="flex items-center">
                Height
                <span className="text-xs text-muted-foreground ml-1">
                  ({measureSystem === "metric" ? "cm" : "inches"})
                </span>
              </Label>
              <Input
                id="height"
                placeholder={measureSystem === "metric" ? "175" : "69"}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                type="number"
                min="1"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="weight" className="flex items-center">
                Weight
                <span className="text-xs text-muted-foreground ml-1">
                  ({measureSystem === "metric" ? "kg" : "lbs"})
                </span>
              </Label>
              <Input
                id="weight"
                placeholder={measureSystem === "metric" ? "70" : "154"}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                type="number"
                min="1"
              />
            </div>
          </div>

          <div className="flex pt-2 gap-2">
            <Button onClick={calculateBMI} className="w-full bg-primary hover:bg-primary-dark">
              Calculate BMI
            </Button>
            {bmi !== null && (
              <Button variant="outline" onClick={resetCalculator} className="flex-shrink-0">
                Reset
              </Button>
            )}
          </div>

          {bmi !== null && category && (
            <div className="mt-6 animate-fade-in">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">0</span>
                  <span className="text-sm font-medium">40+</span>
                </div>
                <Progress value={animateValue} className="h-3" />
                
                <div className="flex justify-between items-center pt-4">
                  <h3 className="text-xl font-bold">Your BMI: {bmi}</h3>
                  <div 
                    className="px-3 py-1 rounded-full text-sm font-medium" 
                    style={{backgroundColor: `${category.color}20`, color: category.color}}
                  >
                    {category.name}
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm">{category.description}</p>
                
                <div className="bg-accent/50 p-3 rounded-md mt-2">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    <p className="text-sm">
                      BMI is a screening tool, not a diagnostic. 
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="underline ml-1 cursor-help">
                            Learn more
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-80">
                              BMI doesn't directly measure body fat and doesn't account for factors 
                              like muscle mass, bone density, or ethnicity. Consult with a healthcare 
                              provider for a comprehensive health assessment.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t p-4 text-xs text-muted-foreground">
        This calculator is for informational purposes only and not a substitute for professional medical advice.
      </CardFooter>
    </Card>
  );
}
