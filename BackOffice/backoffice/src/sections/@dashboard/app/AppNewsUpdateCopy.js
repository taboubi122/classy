// @mui
import PropTypes from 'prop-types';
import { Box, Stack, Link, Card, Button, Divider, Typography, CardHeader } from '@mui/material';
import { NavLink } from 'react-router-dom';
// utils
// components
import Scrollbar from '../../../components/scrollbar';
// ----------------------------------------------------------------------

AppNewsUpdateCopy.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function AppNewsUpdateCopy({ title, subheader, list, ...other }) {
  
  return (
    <Card {...other}>
          <CardHeader title={title} subheader={subheader} />
      
          <Scrollbar>
            <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
              {list.map((news) => (
                <NavLink to={`/dashboardCentre/${news.id}/appCentre`} key={news.id} className="navLink">
                  <div>
                    <NewsItem key={news.id} news={news}/>
                  </div>
                </NavLink>
              ))}
            </Stack>
          </Scrollbar>

      <Divider />
    </Card>
  );
}

// ----------------------------------------------------------------------

NewsItem.propTypes = {
  news: PropTypes.shape({
    description: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
  }),
};

function NewsItem({ news }) {
  const { image, title, description, postedAt } = news;
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box component="img" alt={title} src={image} sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }} />

      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
        <Link color="inherit" variant="subtitle2" underline="hover" noWrap>
          {title}
        </Link>

        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {description}
        </Typography>
      </Box>

      <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
        {postedAt}
      </Typography>
    </Stack>
  );
}
