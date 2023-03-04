import { Progress, ProgressBar, ProgressProps } from "@reusable-ui/components";

export default (props: ProgressProps) => <Progress {...props} semanticRole='status' aria-label='Loading...'>
    <ProgressBar value={100} progressBarStyle='striped' running />
</Progress>