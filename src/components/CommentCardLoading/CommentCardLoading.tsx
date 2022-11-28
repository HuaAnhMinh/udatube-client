const CommentCardLoading = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
      <div style={{
          width: 40,
          height: 40,
          backgroundImage: 'linear-gradient(to right, lightgrey , #eeeeee)',
          borderRadius: '50%',
          marginRight: '10px',
        }}
      />
      <div>
        <div style={{ width: '100px', height: '15px', borderRadius: '4px', backgroundImage: 'linear-gradient(to right, lightgrey , #eeeeee)', marginBottom: '5px' }} />
        <div style={{ width: '200px', height: '25px', borderRadius: '4px', backgroundImage: 'linear-gradient(to right, lightgrey , #eeeeee)' }} />
      </div>
    </div>
  );
};

export default CommentCardLoading;