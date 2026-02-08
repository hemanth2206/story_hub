import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

function Articles() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([
    { name: 'All Categories' },
    { name: 'Romantic' },
    { name: 'Horror' },
    { name: 'Adventure' }
  ]);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { getToken } = useAuth();

  // Fetch articles from the backend
  async function getArticles(category) {
    try {
      const token = await getToken();
      let url = 'http://localhost:3000/author-api/articles';
      
      // Add category to URL only if it's not 'All Categories'
      if (category !== 'All Categories') {
        url += `?category=${encodeURIComponent(category)}`;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.message === 'articles') {
        setArticles(res.data.payload || []);
        setError('');
      } else {
        setError(res.data.message || 'No articles found');
      }
    } catch (err) {
      setError('Failed to fetch articles');
    }
  }

  // Handle dropdown change
  function handleCategoryChange(event) {
    const selected = event.target.value;
    setSelectedCategory(selected);
  }

  // Navigate to article details
  function gotoArticleById(articleObj) {
    navigate(`../${articleObj.articleId}`, { state: articleObj });
  }

  // Fetch articles when `selectedCategory` changes
  useEffect(() => {
    getArticles(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className='container'>
      {error && <p className='display-4 text-center mt-5 text-danger'>{error}</p>}
      
      {/* Category Filter Dropdown */}
      <div className='mb-3'>
        <select className='form-select' value={selectedCategory} onChange={handleCategoryChange}>
          {categories.map((cat, index) => (
            <option key={index} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Articles List */}
      <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3'>
        {articles.map((articleObj) => (
          <div className='col' key={articleObj.articleId}>
            <div className='card h-100'>
              <div className='card-body'>
                {/* Author Details */}
                <div className='author-details text-end'>
                  <img 
                    src={articleObj.authorData?.profileImageUrl || '/default-profile.png'} 
                    width='50px' className='rounded-circle' alt='Author'
                  />
                  <p>
                    <small className='text-secondary'>{articleObj.authorData?.nameOfAuthor || 'Unknown Author'}</small>
                  </p>
                </div>

                {/* Article Info */}
                <h5 className='card-title'>{articleObj.title}</h5>
                <p className='card-text'>{articleObj.content?.substring(0, 80) + '....'}</p>
                <button className='custom-btn btn-4' onClick={() => gotoArticleById(articleObj)}>Read Story</button>
              </div>

              {/* Article Footer */}
              <div className='card-footer'>
                <small className='text-body-secondary'>Last updated on {articleObj.dateOfModification || 'N/A'}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Articles;
