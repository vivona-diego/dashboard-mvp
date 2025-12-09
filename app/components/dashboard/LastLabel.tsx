'use client'

interface LastLabelProps {
    date_range: string;
}

const LastLabel = ({ date_range }: LastLabelProps) => {
    const text: { [key: string]: string } = {
        today: 'Yesterday',
        yesterday: 'Day Before',
        this_week: 'Last Week',
        last_week: 'Week Before',
        this_month: 'Last Month',
        last_month: 'Month Before',
        this_year: 'Last Year',
    };

    return (
        <h4>vs. {text[date_range] || ''}</h4>
    );
}

export default LastLabel;
