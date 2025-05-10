
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  height: z.string()
    .min(1, { message: 'Height is required' })
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Height must be a positive number',
    }),
  weight: z.string()
    .min(1, { message: 'Weight is required' })
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Weight must be a positive number',
    }),
  unit: z.enum(['metric', 'imperial'])
});

type FormValues = z.infer<typeof formSchema>;

const BMICalculator = () => {
  const [bmiResult, setBmiResult] = useState<{ bmi: number; category: string; color: string } | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      height: '',
      weight: '',
      unit: 'metric',
    },
  });

  const calculateBMI = (values: FormValues) => {
    const weight = parseFloat(values.weight);
    const height = parseFloat(values.height);
    let bmi: number;

    if (values.unit === 'metric') {
      // Height in cm, weight in kg
      bmi = weight / Math.pow(height / 100, 2);
    } else {
      // Height in inches, weight in pounds
      bmi = (weight * 703) / Math.pow(height, 2);
    }

    bmi = parseFloat(bmi.toFixed(1));

    let category: string;
    let color: string;

    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-blue-500';
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Healthy Weight';
      color = 'text-green-500';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
      color = 'text-yellow-500';
    } else {
      category = 'Obese';
      color = 'text-red-500';
    }

    return { bmi, category, color };
  };

  const onSubmit = (values: FormValues) => {
    const result = calculateBMI(values);
    setBmiResult(result);
    
    toast({
      title: "BMI Calculated",
      description: `Your BMI is ${result.bmi}, which is classified as ${result.category}`,
    });
  };

  // Function to determine progress bar value and color
  const getProgressProps = () => {
    if (!bmiResult) return { value: 0, className: '' };
    
    // BMI scale typically goes from 10 to 40 for visual representation
    const minBMI = 10;
    const maxBMI = 40;
    const clampedBMI = Math.min(Math.max(bmiResult.bmi, minBMI), maxBMI);
    
    // Calculate percentage position on the scale
    const value = ((clampedBMI - minBMI) / (maxBMI - minBMI)) * 100;
    
    // Determine color based on BMI category
    let className = '';
    if (bmiResult.category === 'Underweight') className = 'bg-blue-500';
    else if (bmiResult.category === 'Healthy Weight') className = 'bg-green-500';
    else if (bmiResult.category === 'Overweight') className = 'bg-yellow-500';
    else className = 'bg-red-500';
    
    return { value, className };
  };

  const progressProps = getProgressProps();

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Unit System</FormLabel>
                  <div className="flex rounded-md overflow-hidden">
                    <Button
                      type="button"
                      variant={field.value === 'metric' ? 'default' : 'outline'}
                      className={`rounded-r-none flex-1 ${field.value === 'metric' ? 'bg-primary text-white' : ''}`}
                      onClick={() => field.onChange('metric')}
                    >
                      Metric (cm/kg)
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === 'imperial' ? 'default' : 'outline'}
                      className={`rounded-l-none flex-1 ${field.value === 'imperial' ? 'bg-primary text-white' : ''}`}
                      onClick={() => field.onChange('imperial')}
                    >
                      Imperial (in/lbs)
                    </Button>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Height ({form.watch('unit') === 'metric' ? 'cm' : 'inches'})
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={form.watch('unit') === 'metric' ? 'e.g. 170' : 'e.g. 67'}
                      {...field}
                      type="number"
                      step="0.1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Weight ({form.watch('unit') === 'metric' ? 'kg' : 'lbs'})
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={form.watch('unit') === 'metric' ? 'e.g. 70' : 'e.g. 150'}
                      {...field}
                      type="number"
                      step="0.1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full">Calculate BMI</Button>
        </form>
      </Form>

      {bmiResult && (
        <div className="mt-8 p-6 border rounded-lg bg-gray-50">
          <h3 className="text-xl font-medium mb-2">Your Results</h3>
          
          <div className="flex items-center justify-between mb-2">
            <span>BMI Score</span>
            <span className={`text-xl font-bold ${bmiResult.color}`}>
              {bmiResult.bmi}
            </span>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between text-xs mb-1">
              <span>Underweight</span>
              <span>Normal</span>
              <span>Overweight</span>
              <span>Obese</span>
            </div>
            <Progress
              value={progressProps.value}
              className="h-2 bg-gray-200"
              indicatorClassName={progressProps.className}
            />
            <div className="flex justify-between text-xs mt-1 text-gray-500">
              <span>16</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>40</span>
            </div>
          </div>
          
          <div className="p-4 rounded-md bg-white border">
            <h4 className={`font-medium ${bmiResult.color}`}>
              {bmiResult.category}
            </h4>
            <p className="text-sm mt-2 text-gray-600">
              {bmiResult.category === 'Underweight' && 'Being underweight can be associated with health issues like nutritional deficiencies and decreased immune function. Consider consulting with a healthcare provider.'}
              {bmiResult.category === 'Healthy Weight' && 'Your BMI indicates a healthy weight. Maintain a balanced diet and regular physical activity to stay in this range.'}
              {bmiResult.category === 'Overweight' && 'Being overweight may increase your risk of heart disease and other conditions. Small lifestyle changes can help you move toward a healthier weight.'}
              {bmiResult.category === 'Obese' && 'Obesity is linked to various health conditions including diabetes and heart disease. We recommend speaking with a healthcare provider about weight management options.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BMICalculator;
